import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Emails protegidos que nunca perdem o acesso via webhook
const PROTECTED_EMAILS = [
  'francoinvestimentoss@gmail.com',
  'elinaldo.silva.franco@gmail.com'
]

function generateRandomPassword(length = 16): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let password = ''
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  for (let i = 0; i < length; i++) {
    password += charset[array[i] % charset.length]
  }
  return password
}

serve(async (req) => {
  // Responder OPTIONS para CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('=== WEBHOOK INICIADO ===')

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const payload = await req.json()
    console.log('Payload recebido:', JSON.stringify(payload, null, 2))

    const order = payload.order || payload
    const { order_status, order_id } = order
    const customer = order.Customer || order.customer
    const product = order.Product || order.product

    const email = customer?.email
    const fullName = customer?.full_name || customer?.first_name || ''
    const product_id = product?.product_id

    console.log('Dados:', { email, fullName, order_status, order_id })

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'No email provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const isPaid = order_status === 'paid'

    if (isPaid) {
      console.log('💰 Pagamento aprovado!')

      // Extrair e sanitizar CPF (agora feito antes de tudo para usar no profile e na criação de user)
      let finalCpf: string | null = null
      const rawCpf = customer?.cpf || customer?.CPF || customer?.doc || customer?.document
      console.log('Dados do cliente para CPF:', JSON.stringify(customer)) // Log para debug

      if (rawCpf) {
        const sanitizedCpf = rawCpf.replace(/\D/g, '')
        if (sanitizedCpf.length > 0) {
          finalCpf = sanitizedCpf
          console.log('✅ CPF identificado e sanitizado:', finalCpf)
        } else {
          console.log('⚠️ CPF encontrado mas vazio após sanitização:', rawCpf)
        }
      } else {
        console.log('⚠️ CPF não encontrado no payload do cliente. Chaves disponíveis:', Object.keys(customer || {}))
      }

      // Criar ou obter usuário no Auth
      const { data: users } = await supabase.auth.admin.listUsers()
      const existingUser = users?.users?.find(u => u.email === email)
      let userId = existingUser?.id

      if (!existingUser) {
        console.log('Criando usuário...')

        // Define senha: usa CPF se existir, senão gera aleatória
        let password = finalCpf || generateRandomPassword()
        if (finalCpf) {
          console.log('Usando CPF como senha inicial')
        }

        const { data: newUser, error: authError } = await supabase.auth.admin.createUser({
          email,
          password: password,
          email_confirm: true,
          user_metadata: { full_name: fullName }
        })

        if (authError) {
          console.error('Erro ao criar usuário:', authError)
          // Se falhou ao criar mas o usuário já existe no Auth (raro se listUsers funcionou), tentamos recuperar
          if (authError.message.includes('already registered')) {
            const { data: retryUsers } = await supabase.auth.admin.listUsers()
            userId = retryUsers?.users?.find(u => u.email === email)?.id
          }
        } else {
          console.log('✅ Usuário criado!')
          userId = newUser.user.id
        }
      } else {
        console.log('Usuário já existe no Auth, usando ID existente.')

        // Se temos CPF, atualizamos a senha para garantir que o usuário consiga logar
        if (finalCpf && existingUser.id) {
          console.log('Atualizando senha de usuário existente para CPF...')
          const { error: updateError } = await supabase.auth.admin.updateUserById(
            existingUser.id,
            { password: finalCpf }
          )

          if (updateError) {
            console.error('❌ Erro ao atualizar senha:', updateError)
          } else {
            console.log('✅ Senha atualizada para o CPF.')
          }
        }
      }

      if (!userId) {
        throw new Error('Não foi possível obter o ID do usuário para o perfil.')
      }

      // Criar/atualizar perfil
      console.log('Criando/atualizando perfil para ID:', userId)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          email,
          full_name: fullName,
          cpf: finalCpf, // Salvando o CPF no perfil
          has_access: true,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'email'
        })
        .select()

      if (profileError) {
        console.error('❌ Erro perfil:', profileError)
        return new Response(
          JSON.stringify({ error: profileError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.log('✅ Perfil processado:', profile)

      // Registrar compra
      await supabase.from('purchases').insert({
        email, product_id, order_id, status: order_status
      })

    } else if (order_status === 'refunded' || order_status === 'chargedback') {
      // Verificar se o email é protegido
      if (PROTECTED_EMAILS.includes(email)) {
        console.log(`⚠️ Email protegido detectado (${email}). Acesso mantido.`);
      } else {
        console.log('🔒 REVOGANDO ACESSO');
        await supabase.from('profiles').update({ has_access: false }).eq('email', email)
      }
    }

    console.log('=== SUCESSO ===')

    return new Response(
      JSON.stringify({ success: true, email, order_id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('ERRO:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
