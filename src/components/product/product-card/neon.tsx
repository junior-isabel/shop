import Image from "next/image";
import cn from "classnames";
import { siteSettings } from "@settings/site.settings";
import usePrice from "@utils/use-price";
import { AddToCart } from "@components/product/add-to-cart/add-to-cart";
import { useUI } from "@contexts/ui.context";

type NeonProps = {
  product: any;
  className?: string;
};

const Neon: React.FC<NeonProps> = ({ product, className }) => {
  const { name, image, quantity, product_type } = product ?? {};
  const { price, basePrice, discount } = usePrice({
    amount: product.price,
    baseAmount: product.sale_price,
  });
  const { openModal, setModalView, setModalData } = useUI();

  function handleProductQuickView() {
    const url: URL = new URL(window.location)
    url.pathname = `/a/${product.slug}`
    window.history.pushState({}, product.slug, url)
    setModalData(product.slug);
    setModalView("PRODUCT_DETAILS");
    return openModal();
  }
  
  return (
    <article
      className={cn(
        "product-card cart-type-neon rounded h-full bg-white overflow-hidden shadow-sm transition-all duration-200 hover:shadow transform hover:-translate-y-0.5",
        className
      )}
    >
      <div
        className="relative flex items-center justify-center cursor-pointer w-auto h-48 sm:h-64"
        onClick={handleProductQuickView}
      >
        <Image
          src={image?.original ?? siteSettings?.product?.placeholderImage}
          alt={name}
          layout="fill"
          objectFit="contain"
          className="product-image"
        />
        {discount && (
          <div className="absolute top-3 right-3 md:top-4 md:right-4 rounded text-xs leading-6 font-semibold px-1.5 sm:px-2 md:px-2.5 bg-primary text-white">
            {discount}
          </div>
        )}
      </div>
      {/* End of product image */}

      <header className="p-3 md:p-6">
        <div className="flex items-center mb-2">
          <span className="text-sm md:text-base text-heading font-semibold">
            {basePrice ? basePrice : price}
          </span>
          {discount && (
            <del className="text-xs md:text-sm text-gray-400 ml-2">{price}</del>
          )}
        </div>
        {/* End of product price */}

        <h3
          className="text-xs md:text-sm text-body truncate mb-4 cursor-pointer"
          onClick={handleProductQuickView}
        >
          {name}
        </h3>
        {/* End of product title */}

        {quantity > 0 ? (
          <div>
            {product_type == "simple" ? (
                <AddToCart variant="neon" data={product} />
              ) : (
                <div onClick={handleProductQuickView} style={{position:'relative'}}>
                  <div style={{width:'100%',height:'100%',background:'transparent',position:'absolute',top:'0px'}}></div>
                  <AddToCart variant="neon" data={product} /> 
                </div>
                
            )}
            

          </div>
 
          

          
        ) : (
          <div className="bg-red-500 rounded text-xs text-center text-white px-2 py-1.5 sm:py-2.5">
            Fora de estoque
          </div>
        )}
        {/* End of add to cart */}
      </header>
    </article>
  );
};

export default Neon;
