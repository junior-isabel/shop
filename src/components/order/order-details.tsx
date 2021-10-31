import NotFound from "@components/common/not-found";
import { Table } from "@components/ui/table";
import usePrice from "@utils/use-price";
import { siteSettings } from "@settings/site.settings";
import { formatAddress } from "@utils/format-address";
import OrderStatus from "./order-status";

const orderTableColumns = [
  {
    title: "Produtos",
    dataIndex: "",
    key: "items",
    width: 250,
    ellipsis: true,
    render: (_: any, record: any) => {
      const { price } = usePrice({
        amount: +record.pivot?.unit_price,
      });
      let name = record.name;
      if (record.pivot?.variation_option_id) {
        const variationTitle = record.variation_options?.find(
          (vo: any) => vo.id === record.pivot.variation_option_id
        )["title"];
        name = `${name} - ${variationTitle}`;
      }
      return (
        <div className="flex items-center">
          <div className="w-16 h-16 flex flex-shrink-0 rounded overflow-hidden">
            <img
              src={
                record.image?.thumbnail ?? siteSettings.product.placeholderImage
              }
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col ml-4 overflow-hidden">
            <div className="flex mb-1">
              <span className="text-sm text-body truncate inline-block overflow-hidden">
                {name} x&nbsp;
              </span>
              <span className="text-sm text-heading font-semibold truncate inline-block overflow-hidden">
                {record.unit}
              </span>
            </div>
            <span className="text-sm text-primary font-semibold mb-1 truncate inline-block overflow-hidden">
              {price}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    title: "Qtd",
    dataIndex: "pivot",
    key: "pivot",
    align: "center",
    width: 100,
    render: (pivot: any) => {
      return <p className="text-body">{pivot.order_quantity}</p>;
    },
  },
  {
    title: "Preço",
    dataIndex: "pivot",
    key: "price",
    align: "right",
    width: 100,
    render: (pivot: any) => {
      const { price } = usePrice({
        amount: +pivot.subtotal,
      });
      return <p>{price}</p>;
    },
  },
];

interface Props {
  order: any;
}

const OrderDetails = ({ order }: Props) => {
  const {
    products,
    status,
    obs,
    shipping_address,
    billing_address,
    tracking_number,
  } = order ?? {};

  const { price: amount } = usePrice({
    amount: order?.amount,
  });
  const { price: discount } = usePrice({
    amount: order?.discount,
  });
  const { price: total } = usePrice({
    amount: order?.total,
  });
  const { price: delivery_fee } = usePrice({
    amount: order?.delivery_fee,
  });
  const { price: sales_tax } = usePrice({
    amount: order?.sales_tax,
  });

  return (
    
    <div className="flex flex-col w-full md:w-2/3 border border-gray-200">
      {order ? (
        <>
          <h2 className="font-semibold text-xl text-gray-800 p-5 border-b border-gray-200">
          Encomenda - {tracking_number}
          </h2>
         
          <div className="flex flex-col sm:flex-row border-b border-gray-200">
            <div className="w-full md:w-3/5 flex flex-col px-5 py-4 border-b sm:border-b-0 sm:border-r border-gray-200">
              {/* <div className="mb-4">
                <span className="text-sm text-heading font-bold mb-2 block">
                  Endereço para Envio
                </span>

                <span className="text-sm text-body">
                  {formatAddress(shipping_address)}
                </span>
              </div> */}

              <div>
                <span className="text-sm text-heading font-bold mb-2 block">
                  Endereço para Entrega
                </span>

                <span className="text-sm text-body">
                  {formatAddress(billing_address)}
                </span>
              </div>
              <div>
                <span className="text-sm text-heading font-bold mt-5 mb-2 block">
                 Obs:
                </span>

                <span className="text-sm text-body">
                  {obs}
                </span>
              </div>
            </div>

            <div className="w-full md:w-2/5 flex flex-col px-5 py-4">
              <div className="flex justify-between mb-3">
                <span className="text-sm text-body">Sub Total</span>
                <span className="text-sm text-heading">{amount}</span>
              </div>

              <div className="flex justify-between mb-3">
                <span className="text-sm text-body">Descontos</span>
                <span className="text-sm text-heading">{discount}</span>
              </div>

              <div className="flex justify-between mb-3">
                <span className="text-sm text-body">Taxa de Entrega</span>
                <span className="text-sm text-heading">{delivery_fee}</span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-sm text-body">Outras Taxas</span>
                <span className="text-sm text-heading">{sales_tax}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm font-bold text-heading">Total</span>
                <span className="text-sm font-bold text-heading">{total}</span>
              </div>
            </div>
          </div>

          {/* Order Table */}
          <div>
            <div className="w-full flex justify-center items-center px-6">
              <OrderStatus status={status?.serial} />
            </div>

            <Table
              //@ts-ignore
              columns={orderTableColumns}
              data={products ? products : []}
              rowKey={(record: any) =>
                record.pivot?.variation_option_id
                  ? record.pivot.variation_option_id
                  : record.id
              }
              className="orderDetailsTable w-full"
              scroll={{ x: 350, y: 500 }}
            />
          </div>
        </>
      ) : (
        <div className="max-w-lg mx-auto">
          <NotFound text="Nenhum pedido encontrado" />
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
