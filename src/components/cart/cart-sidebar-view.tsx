import { useRouter } from "next/router";
import { motion, AnimateSharedLayout } from "framer-motion";
import { useUI } from "@contexts/ui.context";
import CartCheckBagIcon from "@components/icons/cart-check-bag";
import EmptyCartIcon from "@components/icons/empty-cart";
import { CloseIcon } from "@components/icons/close-icon";
import CartItem from "@components/cart/cart-item";
import { fadeInOut } from "@utils/motion/fade-in-out";
import { ROUTES } from "@utils/routes";
import usePrice from "@utils/use-price";
import { useCart } from "@contexts/quick-cart/cart.context";
import { formatString } from "@utils/format-string";

const CartSidebarView = () => {
  const { items, totalUniqueItems, total } = useCart();
  const { closeSidebar } = useUI();
  const router = useRouter();
  function handleCheckout() {
    router.push(ROUTES.CHECKOUT);
    return closeSidebar();
  }

  const { price: totalPrice } = usePrice({
    amount: total,
  });
  return (
    <section className="flex flex-col h-full relative">
      <header className="fixed max-w-md w-full top-0 z-10 bg-white py-4 px-6 flex items-center justify-between border-b border-gray-200 border-opacity-75">
        <div className="flex text-primary font-semibold">
          <CartCheckBagIcon className="flex-shrink-0" width={24} height={22} />
          <span className="flex ml-2">
            {formatString(totalUniqueItems, "Item")}
          </span>
        </div>
        <button
          onClick={() => closeSidebar()}
          className="w-7 h-7 ml-3 -mr-2 flex items-center justify-center rounded-full text-gray-400 bg-gray-100 transition-all duration-200 focus:outline-none hover:bg-primary focus:bg-primary hover:text-white focus:text-white"
        >
          <span className="sr-only">close</span>
          <CloseIcon className="w-3 h-3" />
        </button>
      </header>
      {/* End of cart header */}

      <AnimateSharedLayout>
        <motion.div layout className="flex-grow pt-16">
          {items.length > 0 ? (
            items?.map((item) => <CartItem item={item} key={item.id} />)
          ) : (
            <motion.div
              layout
              initial="from"
              animate="to"
              exit="from"
              variants={fadeInOut(0.25)}
              className="h-full flex flex-col items-center justify-center"
            >
              <EmptyCartIcon width={140} height={176} />
              <h4 className="mt-6 text-gray-500 font-semibold">
              Nenhum produto encontrado
              </h4>
            </motion.div>
          )}
        </motion.div>
      </AnimateSharedLayout>
      {/* End of cart items */}

      <footer className="sticky left-0 bottom-0 w-full py-5 px-6 z-10 bg-white">
        <button
          className="flex justify-between w-full h-12 md:h-14 p-1 text-sm font-bold bg-primary rounded-full shadow-700 transition-colors focus:outline-none hover:bg-primary-2 focus:bg-primary-2"
          onClick={() => handleCheckout()}
        >
          <span className="flex flex-1 items-center h-full px-5 text-white">
            Pagamento
          </span>
          <span className="flex items-center flex-shrink-0 h-full bg-white text-primary rounded-full px-5">
            {totalPrice}
          </span>
        </button>
      </footer>
      {/* End of footer */}
    </section>
  
  );
};

export default CartSidebarView;
