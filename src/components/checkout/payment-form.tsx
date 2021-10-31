import Button from "@components/ui/button";
import FormattedInput from "@components/ui/formatted-input";
import Input from "@components/ui/input";
import Label from "@components/ui/label";
import Radio from "@components/ui/radio/radio";
import { useCheckout } from "@contexts/checkout.context";
import { formatOrderedProduct } from "@utils/format-ordered-product";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import ValidationError from "@components/ui/validation-error";
import { ROUTES } from "@utils/routes";
import { useCreateOrderMutation } from "@data/order/use-create-order.mutation";
import { useOrderStatusesQuery } from "@data/order/use-order-statuses.query";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useCart } from "@contexts/quick-cart/cart.context";
import React, { useState, useEffect } from "react";
import { useCustomerQuery } from "@data/customer/use-customer.query";
import { useSettings } from "@contexts/settings.context";


import {
  calculatePaidTotal,
  calculateTotal,
} from "@contexts/quick-cart/cart.utils";
interface FormValues {
  payment_gateway: "cod" | "stripe" | "paypal" | "mbway"| "mb";
  contact: string;
  contact_mbway: string;
  email: string;
  nif: string;
  order: string;
  card: {
    number: string;
    expiry: string;
    cvc: string;
  };
}
const paymentSchema = Yup.object().shape({
  contact: Yup.string().min(9, "Por-favor adicione um contato válido ao seu perfil").required(),
  payment_gateway: Yup.string().default("stripe").oneOf(["cod", "stripe","paypal", "mbway", "mb"]),
  card: Yup.mixed().when("payment_gateway", {
    is: (value: string) => value === "stripe",
    then: Yup.object().shape({
      number: Yup.string().required("Por-favor introduza o número do cartão"),
      expiry: Yup.string().required("A data é obrigatória"),
      cvc: Yup.string().required("Digite o CVC do seu cartão"),
    }),
  }),
});

export default function PaymentForm() {
  const { data } = useCustomerQuery();

  const [order,setOrder] = useState({id: null, tracking_number: null, entity: null, reference: null, value: null})
  
  
  useEffect(() => {

    if(!order.id)
      return;
      var timer = setInterval(() => {
        fetch(`${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}`+"/order_paid?order="+order.tracking_number)
        .then((resp) => resp.json())
        .then(function(res) {
          console.log(res);
          if(res == 1){
            clearInterval(timer);
            router.push(`${ROUTES.ORDER_RECEIVED}/${order?.tracking_number}`);
          }
        });
      },5000);
    console.log(order);
  }, [order]);


  const router = useRouter();
  const { mutate: createOrder, isLoading: loading } = useCreateOrderMutation();
  

  const contact = data?.me?.profile?.contact;
  
  const { data: orderStatusData } = useOrderStatusesQuery();

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(paymentSchema),
    defaultValues: {
      contact: contact,
      contact_mbway: contact,
      payment_gateway: "mbway",
    },
  });

  useEffect(() => {
      setValue("contact", data?.me?.profile?.contact);
  }); 

  const { items } = useCart();
  const {
    billing_address,
    shipping_address,
    obs,
    delivery_time,
    checkoutData,
    coupon,
    discount,
  } = useCheckout();

  const available_items = items?.filter(
    (item: any) => !checkoutData?.unavailable_products?.includes(item.id)
  );

  const subtotal = calculateTotal(available_items);
  const total = calculatePaidTotal(
    {
      totalAmount: subtotal,
      tax: checkoutData?.total_tax!,
      shipping_charge: checkoutData?.shipping_charge!,
    },
    discount
  );
  function onSubmit(values: FormValues) {
  
    let input = {
      //@ts-ignore
      products: available_items?.map((item) => formatOrderedProduct(item)),
      customer_contact: values.contact,
      customer_nif: values.nif,
      contact_mbway: values.contact_mbway,
      customer_email: values.email,
      status: orderStatusData?.order_statuses?.data[0]?.id ?? 1,
      amount: subtotal,
      coupon_id: coupon?.id,
      discount: discount ?? 0,
      paid_total: total,
      total,
      sales_tax: checkoutData?.total_tax,
      delivery_fee: checkoutData?.shipping_charge,
      delivery_time: delivery_time,
      obs: obs,
      payment_gateway: values.payment_gateway,
      billing_address: {
        ...(billing_address?.address && billing_address.address),
      },
      shipping_address: {
        ...(shipping_address?.address && shipping_address.address),
      },
    };
    //if (values.payment_gateway === "stripe") {
      // @ts-ignore
      input.card = {
        number: values?.card?.number,
        exp_month: values?.card?.expiry?.split("/")[0],
        exp_year: values?.card?.expiry?.split("/")[1],
        cvc: values?.card?.cvc,
       
    //  };

    }

 
    createOrder(input, {
      onSuccess: (order: any) => {

        if(order.status == "1"){
          router.push(`${ROUTES.ORDER_RECEIVED}/${order?.tracking_number}`);
        }else{
         
          if(order.payment_gateway == "mbway"){
              setOrder(order);
          }else{
              setOrder(order);
          }
        }
      },
    });
  }
  const isCashOnDelivery = watch("payment_gateway");
  const settings = useSettings();
  return (
    
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col"
    >
      
      <div className="mb-6">
      <div className="flex items-center justify-between mb-5 md:mb-8">
        <div className="flex mb-4 items-center space-x-3 md:space-x-4">
              <span className="rounded-full w-8 h-8 bg-primary flex items-center justify-center text-base lg:text-xl text-white">
                {settings?.scheduleType != "store"  && (3)}
                {settings?.scheduleType == "store"  && (2)}
              </span>
              <p className="text-lg lg:text-xl text-heading">
                Pagamento
              </p>
          {/* <Label>Escolha uma Forma de Pagamento</Label> */}
          </div>
          <FormattedInput
              variant="outline"
              className="flex"
              placeholder="+ Contribuinte (NIF)"
              {...register("nif")}
            />

        </div>

        <div className="space-x-4 flex items-center">
          
          <Radio
            id="mbway"
            type="radio"
            {...register("payment_gateway")}
            value="mbway"

            label="<img style='margin-top:-5px;height:27px' src='/mbway.png' alt='MBWAY' />"
            className=""
          /> 
          <Radio
            id="stripe"
            type="radio"
            {...register("payment_gateway")}
            value="stripe"

            label="<img style='margin-top:-5px;height:27px' src='/card.png' alt='CARTÕES' />"
            className=""
          />
          <Radio
            id="mb"
            type="radio"
            {...register("payment_gateway")}
            value="mb"

            label="<img style='margin-top:-6px;height:30px' src='/mb.jpg' alt='MULTIBANCO' />"
            className=""
          />
          {/* 
          <Radio
            id="paypal"
            type="radio"
            {...register("payment_gateway")}
            value="paypal"
            label="<img style='margin-top:-6px;height:24px' src='/paypal.png' alt='PayPal' />"
            className=""
          />
       
         <Radio
            id="cod"
            type="radio"
            {...register("payment_gateway")}
            value="cod"
            label="Dinheiro na entrega"
            className=""
          />
           */}
        </div>
      </div>

     
      
      {isCashOnDelivery === "stripe" && (
        <div>



          <Label>Informações do Cartão</Label>
          <Input 
            {...register("contact", { required: "O número de contato é obrigatório" })}
            variant="outline"
            className="w-1/2"
            error={errors?.contact?.message} 
            style={{display:"none"}}
          />
          <FormattedInput
            variant="outline"
            className=""
            placeholder="Número do Cartão"
            {...register("card.number")}
            options={{
              creditCard: true,
            }}
            error={errors?.card?.number?.message}
          />

          <div className="flex space-x-4 w-full">
            <FormattedInput
              variant="outline"
              className="w-1/2"
              placeholder="M/Y"
              options={{ date: true, datePattern: ["m", "y"] }}
              {...register("card.expiry")}
              error={errors?.card?.expiry?.message}
            />
            <FormattedInput
              variant="outline"
              className="w-1/2"
              placeholder="CVC"

              options={{ blocks: [3] }}
              {...register("card.cvc")}
              error={errors?.card?.cvc?.message}
            />
          </div>
        </div>
      )}
      {!subtotal && (
        <ValidationError message="Your ordered items are unavailable" />
      )}
      {total < 0 && (
        <div className="mt-3">
          <ValidationError message="Sorry, we can't process your order :(" />
        </div>
      )}
  {isCashOnDelivery === "paypal" && (
         <div>
         <Button
        loading={loading}
        disabled={!subtotal || total < 0}
        className="w-full lg:w-auto lg:ml-auto mt-5"
      >
      Fazer Pagamento →
      </Button>
       </div>
      )}
      {isCashOnDelivery === "mbway" && (
         <div>
           <p className="mb-5"><small>Info (#2): Aguarde nesta tela depois de aceitar a solicitação no seu app MBWAY, ou bancário.</small></p>
            <div className="flex space-x-4 w-full">
                
                <Input
                  {...register('contact_mbway', { required: "O número de contato é obrigatório" })}
                  label="Nº Tel. MBWAY"
                  variant="outline"
                  className="w-1/2"
                  error={errors?.contact_mbway?.message}
                />
                <div style={{display:'none'}}>
                 <Input
                  {...register('contact', { required: "O número de contato é obrigatório" })}
                  label="Nº Telemóvel"
                  variant="outline"
                  className="w-1/2"
                  error={errors?.contact?.message}
                />
              </div>
               
                <Button
                  loading={loading}
                  disabled={!subtotal || total < 0}
                  className="w-1/2"
                  style={{marginTop:"26px"}}
                >
              Enviar <span className="hidden lg:block">&nbsp;Solicitação</span> →
              </Button>
          </div>
       </div>
      )}
      {isCashOnDelivery === "mb" && (
        <div>
         <Input 
            {...register("contact", { required: "O número de contato é obrigatório" })}
            variant="outline"
            className="w-1/2"
            error={errors?.contact?.message} 
            style={{display:"none"}}
          />
        <div>
          { order?.entity &&
            <p><b>Entidade: </b> {order.entity}<br /><b>Referência: </b>{order.reference}<br /><b>Valor: </b> € {order.value}</p>
          }
        </div>
        { !order?.entity &&
          <Button
            loading={loading}
            disabled={!subtotal || total < 0}
            className="w-full lg:w-auto lg:ml-auto mt-5"
          >
          Gerar Refência →
          </Button>
        }

        </div>
      )}
       {isCashOnDelivery === "stripe" && (
      <Button
        loading={loading}
        disabled={!subtotal || total < 0}
        className="w-full lg:w-auto lg:ml-auto mt-5"
      >
        Fazer Pagamento seguro →
      </Button>
      )}
    </form>
  );
};



