import { useEffect } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import Link from "@components/ui/link";
import Layout from "@components/layout/layout";
import usePrice from "@utils/use-price";
import { formatAddress } from "@utils/format-address";
import { formatString } from "@utils/format-string";
import { parseContextCookie } from "@utils/parse-cookie";
import { useCheckout } from "@contexts/checkout.context";
import Spinner from "@components/ui/loaders/spinner/spinner";
import { useOrderQuery } from "@data/order/use-order.query";
import { ROUTES } from "@utils/routes";
import { useSearch } from "@contexts/search.context";
import { useCart } from "@contexts/quick-cart/cart.context";

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const cookies = parseContextCookie(context?.req?.headers?.cookie);
  if (!cookies?.auth_token) {
    return { redirect: { destination: "/", permanent: false } };
  }
  return {
    props: {},
  };
};

export default function OrderReceived() {
  const { query } = useRouter();
  const { resetCart } = useCart();
  const { clearCheckoutData } = useCheckout();
  const { updateSearchTerm } = useSearch();

  useEffect(() => {
    resetCart();
    clearCheckoutData();
    updateSearchTerm("");
  }, []);

  const { data, isLoading: loading } = useOrderQuery({
    tracking_number: query.tracking_number as string,
  });

  const { price: total } = usePrice(data && { amount: data.order.paid_total });
  const { price: sub_total } = usePrice(data && { amount: data.order.amount });
  const { price: shipping_charge } = usePrice(
    data && { amount: data?.order?.delivery_fee ?? 0 }
  );
  const { price: tax } = usePrice(
    data && { amount: data?.order?.sales_tax ?? 0 }
  );
  const { price: discount } = usePrice(
    data && { amount: data?.order?.discount ?? 0 }
  );

  if (loading) {
    return <Spinner showText={false} />;
  }

  return (
    <div className="p-4 sm:p-8">
      
      <div className="p-6 sm:p-8 lg:p-12 max-w-screen-lg w-full mx-auto bg-white rounded border shadow-sm">
        
      <div className="text-center" style={{textAlign:'center'}}>
          <img src="/success.gif" alt="" width="120px" style={{margin:'0px auto'}} />
        </div>
        <h2 className="flex items-center justify-between text-xl font-bold text-gray-800 mb-4 sm:mb-5">
          
          <span>Pedido Recebido</span>
          <Link
            href={ROUTES.HOME}
            className="inline-flex items-center text-primary text-base font-normal underline hover:no-underline hover:text-primary-2"
          >
           Voltar à Página Inicial
          </Link>
        </h2>
        <p className="leading-relaxed text-gray-600 mb-8 sm:mb-10">
        Obrigado. Seu pedido foi recebido
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          <div className="py-4 px-5 border border-gray-200 rounded shadow-sm">
            <h3 className="mb-2 text-sm text-gray-800 font-semibold">
            Número do pedido
            </h3>
            <p className="text-sm  text-gray-600">
              {data?.order?.tracking_number}
            </p>
          </div>
          <div className="py-4 px-5 border border-gray-200 rounded shadow-sm">
            <h3 className="mb-2 text-sm  text-gray-800 font-semibold">Data</h3>
            <p className="text-sm text-gray-600">
              {dayjs(data?.order?.created_at).format("DD-MM-YYYY")} 
            </p>
          </div>
          <div className="py-4 px-5 border border-gray-200 rounded shadow-sm">
            <h3 className="mb-2 text-sm  text-gray-800 font-semibold">Total</h3>
            <p className="text-sm  text-gray-600">{total}</p>
          </div>
          <div className="py-4 px-5 border border-gray-200 rounded shadow-sm">
            <h3 className="mb-2 text-sm  text-gray-800 font-semibold">
            Forma de Pagamento
            </h3>
            <p className="text-sm text-gray-600">
              {data?.order?.payment_gateway}
            </p>
          </div>
        </div>
        {/* end of order received  */}

        <h2 className="text-xl font-bold text-gray-800 mb-6">Detalhes do Pedido</h2>
        <div className="mb-12">
          <p className="flex text-gray-600 mt-5">
            <strong className="w-3/12 text-sm  text-gray-800 font-semibold">
              Total 
            </strong>
            :
            <span className="w-9/12 pl-4 text-sm ">
              {formatString(data?.order?.products?.length, "Item")}
            </span>
          </p>
          <p className="flex text-gray-600 mt-5">
            <strong className="w-3/12 text-sm  text-gray-800 font-semibold">
            Data de entrega
            </strong>
            :
            <span className="w-9/12 pl-4 text-sm ">
              {data?.order?.delivery_time} {data?.order?.delivery_hour}
            </span> 
          </p>
          <p className="flex text-gray-600 mt-5">
            <strong className="w-3/12 text-sm text-gray-800 font-semibold">
            Endereço de Envio
            </strong>
            :
            <span className="w-9/12 pl-4 text-sm ">
              {formatAddress(data?.order?.billing_address!)}
            </span>
          </p>
          <p className="flex text-gray-600 mt-5">
            <strong className="w-3/12 text-sm  text-gray-800 font-semibold">
           Obs
            </strong>
            :
            <span className="w-9/12 pl-4 text-sm ">
              {data?.order?.obs} 
            </span> 
          </p>
        </div>
        {/* end of order details */}

        <h2 className="text-xl font-bold text-gray-800 mb-6">Valor Total</h2>
        <div>
          <p className="flex text-gray-600 mt-5">
            <strong className="w-3/12 text-sm  text-gray-800 font-semibold">
              Sub Total
            </strong>
            :<span className="w-9/12 pl-4 text-sm ">{sub_total}</span>
          </p>
          <p className="flex text-gray-600 mt-5">
            <strong className="w-3/12 text-sm  text-gray-800 font-semibold">
            Taxa de Envio
            </strong>
            :<span className="w-9/12 pl-4 text-sm ">{shipping_charge}</span>
          </p>
          <p className="flex text-gray-600 mt-5">
            <strong className="w-3/12 text-sm  text-gray-800 font-semibold">
              Taxa
            </strong>
            :<span className="w-9/12 pl-4 text-sm ">{tax}</span>
          </p>
          <p className="flex text-gray-600 mt-5">
            <strong className="w-3/12 text-sm  text-gray-800 font-semibold">
              Desconto
            </strong>
            :<span className="w-9/12 pl-4 text-sm ">{discount}</span>
          </p>
          <p className="flex text-gray-600 mt-5">
            <strong className="w-3/12 text-sm  text-gray-800 font-semibold">
              Total
            </strong>
            :<span className="w-9/12 pl-4 text-sm">{total}</span>
          </p>
        </div>
        {/* end of total amount */}
      </div>
    </div>
  );
}

OrderReceived.Layout = Layout;
