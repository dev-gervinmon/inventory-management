import prisma from "../db/prisma";

export async function getInventoryValue(userId: string) {
  const products = await prisma.product.findMany({
    where: { userId },
    select: {
      quantity: true,
      price: true,
    },
  });

  const totalValue = products.reduce((sum, p) => {
    return sum + Number(p.quantity) * Number(p.price);
  }, 0);

  return {
    totalValue,
  };
}
