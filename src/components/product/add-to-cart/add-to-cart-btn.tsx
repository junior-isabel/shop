import { PlusIcon } from "@components/icons/plus-icon";
import CartIcon from "@components/icons/cart";
import cn from "classnames";

type Props = {
  variant?: "helium" | "neon" | "argon" | "oganesson" | "single" | "big";
  onClick(event: React.MouseEvent<HTMLButtonElement | MouseEvent>): void;
  disabled?: boolean;
};

const AddToCartBtn: React.FC<Props> = ({ variant, onClick, disabled }) => {
  switch (variant) {
    case "neon":
      return (
        <button
          onClick={onClick}
          disabled={disabled}
          className="group w-full h-7 md:h-9 flex items-center justify-between text-xs md:text-sm text-gray-600 rounded bg-gray-100 transition-colors hover:bg-primary hover:border-primary hover:text-white focus:outline-none focus:bg-primary focus:border-primary focus:text-white"
        >
          <span className="flex-1">Adicionar</span>
          <span className="w-7 h-7 md:w-9 md:h-9 bg-gray-200 grid place-items-center rounded-tr rounded-br transition-colors duration-200 group-hover:bg-gossamer-600 group-focus:bg-gossamer-600">
            <PlusIcon className="w-4 h-4 stroke-2" />
          </span>
        </button>
      );
    case "argon":
      return (
        <button
          onClick={onClick}
          disabled={disabled}
          className="w-7 h-7 md:w-9 md:h-9 flex items-center justify-center text-sm text-heading bg-white rounded border border-gray-200 transition-colors hover:bg-primary hover:border-primary hover:text-white focus:outline-none focus:bg-primary focus:border-primary focus:text-white"
        >
          <PlusIcon className="w-5 h-5 stroke-2" />
        </button>
      );
    case "oganesson":
      return (
        <button
          onClick={onClick}
          disabled={disabled}
          className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-sm rounded-full text-white bg-primary shadow-500 transition-colors hover:bg-primary hover:border-primary hover:text-white focus:outline-none focus:bg-primary focus:border-primary focus:text-white"
        >
          <span className="sr-only">plus</span>
          <PlusIcon className="w-5 h-5 md:w-6 md:h-6 stroke-2" />
        </button>
      );
    case "single":
      return (
        <button
          onClick={onClick}
          disabled={disabled}
          className="order-5 sm:order-4 py-2 px-3 sm:px-5 border-2 border-gray-100 flex items-center justify-center sm:justify-start text-sm font-semibold rounded-full text-primary hover:text-white bg-white hover:bg-primary hover:border-primary transition-colors duration-300 focus:outline-none focus:bg-primary focus:border-primary focus:text-white"
        >
          <CartIcon className="w-4 h-4 mr-2.5" />
          <span>Carrinho</span>
        </button>
      );
    case "big":
      return (
        <button
          onClick={onClick}
          disabled={disabled}
          className={cn(
            "py-4 px-5 w-full flex items-center justify-center text-sm lg:text-base font-light rounded text-white bg-primary hover:bg-primary-2 transition-colors duration-300 focus:outline-none focus:bg-primary-2",
            {
              "border !bg-gray-300 hover:!bg-gray-300 border-gray-400 !text-gray-500 cursor-not-allowed": disabled,
            }
          )}
        >
          <span>Adicionar ao Carrinho</span>
        </button>
      );
    default:
      return (
        <button
          onClick={onClick}
          disabled={disabled}
          title={disabled ? "Out Of Stock" : ""}
          className="w-7 h-7 md:w-9 md:h-9 flex items-center justify-center text-sm text-primary bg-white rounded border border-gray-200 transition-colors hover:bg-primary hover:border-primary hover:text-white focus:outline-none focus:bg-primary focus:border-primary focus:text-white"
        >
          <span className="sr-only">plus</span>
          <PlusIcon className="w-5 h-5 stroke-2" />
        </button>
      );
  }
};

export default AddToCartBtn;
