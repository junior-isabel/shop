import Button from "@components/ui/button";
import { useCheckout } from "@contexts/checkout.context";
import usePrice from "@utils/use-price";
import CheckoutCartItem from "@components/checkout/checkout-cart-item";
import { useRouter } from "next/router";
import { formatOrderedProduct } from "@utils/format-ordered-product";
import EmptyCartIcon from "@components/icons/empty-cart";
import { loggedIn } from "@utils/is-loggedin";
import { useUI } from "@contexts/ui.context";
import { useState } from "react";
import ValidationError from "@components/ui/validation-error";
import { useVerifyCheckoutMutation } from "@data/order/use-checkout-verify.mutation";
import { useCart } from "@contexts/quick-cart/cart.context";
import { useSettings } from "@contexts/settings.context";

const VerifyCheckout = () => {
  const router = useRouter();
  const [errorMessage, setError] = useState("");
  const { delivery_time, billing_address, setCheckoutData, checkoutData} = useCheckout();
  const { items, total, isEmpty } = useCart();
  const { openModal, setModalView } = useUI();
  const { price: subtotal } = usePrice(
    items && {
      amount: total,
    } 
  );



  const {
    mutate: verifyCheckout,
    isLoading: loading,
  } = useVerifyCheckoutMutation();
  const settings = useSettings();
  async function handleVerifyCheckout() {
    if (loggedIn()) {
      if(settings?.minAmount <= total){
        if ((settings?.scheduleType != "store"  &&  billing_address && delivery_time) || ((settings?.scheduleType == "store" && billing_address))) {
          //if (billing_address && shipping_address) {
          verifyCheckout(
            {
              amount: total,
              products: items?.map((item) => formatOrderedProduct(item)),
              billing_address: {
                ...(billing_address?.address && billing_address.address),
              },
              shipping_address: {
                ...(billing_address?.address && billing_address.address),
              },
              
            },
            {
              onSuccess: (data) => {
                setCheckoutData(data);
                if(data['shipping_charge'] == 98765){
                  setError("Endereço não suportado ou fora do raio de entrega. Certifique-se de que o endereço esteja selecionado.");
                }else{
                  router.push("/order");
                }
                
              },
              onError: (error) => {
                console.log(error, "error");
              },
            }
          );
        } else {
            if(settings?.scheduleType != "store"){
              setError("Selecione o seu Endereço e a Data");
            }else{
              setError("Adicione ou selecione o seu Endereço");
            }
          
         
        }
      }else{
        setError("Valor inferior ao valor mínimo de: "+parseFloat(settings?.minAmount).toFixed(2)+" €.");
      }
      
    } else {
      setModalView("LOGIN_VIEW");
      openModal();
    }
  }

  return (
    <div className="w-full">
      <div className="flex flex-col items-center space-x-4 mb-4">
        <span className="text-base font-bold text-heading">Seu Pedido</span>
      </div>
      <div className="flex flex-col py-3 border-b border-gray-200">
        {isEmpty ? (
          <div className="h-full flex flex-col items-center justify-center mb-4">
            <EmptyCartIcon width={140} height={176} />
            <h4 className="mt-6 text-gray-500 font-semibold">
            Nenhum produto encontrado
            </h4>
          </div>
        ) : (
          items?.map((item) => <CheckoutCartItem item={item} key={item.id} />)
        )}
      </div>
      <div className="space-y-2 mt-4">
        <div className="flex justify-between">
          <p className="text-sm text-body">Sub Total</p>
          <span className="text-sm text-body">{subtotal}</span>
        </div>
        <div className="flex justify-between">
          <p className="text-sm text-body">IVA</p>
          <span className="text-sm text-body">Cálculo no Checkout</span>
        </div>
        <div className="flex justify-between">
          <p className="text-sm text-body">Entrega Estimada</p>
          <span className="text-sm text-body">Cálculo no Checkout</span>
        </div>
      </div>
      <Button
        loading={loading}
        className="w-full mt-5"
        onClick={handleVerifyCheckout}
        disabled={isEmpty}
      >
        Continuar para o Checkout →
      </Button>

      {errorMessage && (
        <div className="mt-3">
          <ValidationError message={errorMessage} />
        </div>
      )}
    </div>
  );
};

export default VerifyCheckout;
