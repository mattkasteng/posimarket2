import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const { orderId, amount, successUrl, cancelUrl } = await request.json()

    if (!orderId || !amount || !successUrl || !cancelUrl) {
      return NextResponse.json(
        { success: false, error: 'Parâmetros obrigatórios ausentes' },
        { status: 400 }
      )
    }

    // Criar sessão do Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'pix'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: `Pedido #${orderId}`,
              description: 'Produtos do PosiMarket',
            },
            unit_amount: Math.round(amount * 100), // Stripe usa centavos
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        orderId: orderId.toString(),
      },
      customer_email: undefined, // Será preenchido pelo Stripe
    })

    return NextResponse.json({
      success: true,
      url: session.url,
      sessionId: session.id,
    })
  } catch (error) {
    console.error('Erro ao criar sessão do Stripe:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
