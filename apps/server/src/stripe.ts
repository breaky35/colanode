import { FastifyInstance } from "fastify";
import Stripe from "stripe";

export async function stripeRoutes(fastify: FastifyInstance) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

  fastify.post("/api/create-checkout-session", async (request, reply) => {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: { name: "Pro Plan" },
              unit_amount: 499, // €4.99
            },
            quantity: 1,
          },
        ],
        success_url: `${request.headers.origin}/success`,
        cancel_url: `${request.headers.origin}/cancel`,
      });

      return { url: session.url };
    } catch (err: any) {
      fastify.log.error(err);
      reply.status(500).send({ error: err.message });
    }
  });
}
