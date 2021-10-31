import Address from "@components/address/address";
import Schedule from "@components/checkout/schedule";
import Layout from "@components/layout/layout";
import VerifyCheckout from "@components/checkout/verify-checkout";
import { useEffect, useState } from "react";
import { useUI } from "@contexts/ui.context";
import { useCustomerQuery } from "@data/customer/use-customer.query";
import { useSettings } from "@contexts/settings.context";
import { useCheckout } from "@contexts/checkout.context";
import DatePicker,{registerLocale} from 'react-datepicker';
import setMinutes from "date-fns/setMinutes";
import setHours from "date-fns/setHours";
import TextArea from "@components/ui/text-area";
import "react-datepicker/dist/react-datepicker.css";
import ptBR from 'date-fns/locale/pt-BR';
import moment from 'moment';
import { useForm } from "react-hook-form";
registerLocale('ptBR', ptBR); 

interface FormValues {
  obs: string;
}

export default function CheckoutPage() {
  const { data, refetch } = useCustomerQuery();
  const { isAuthorize, openModal, setModalView } = useUI();
  useEffect(() => {
    if (!isAuthorize) {
      setModalView("REGISTER");
      return openModal();
    }
    if (isAuthorize) {
      refetch();
    }
  }, [isAuthorize]);

  const settings = useSettings();
  
  var date = new Date();
  
  const {
    register,
  } = useForm<FormValues>({
    
  });



  if(settings?.scheduleType == "client-by"){
    if(settings?.site?.delivery_time > 0){
      date.setDate(date.getDate() + Number(settings?.site?.delivery_time));
    }
  }

  var start = new Date();
  if(settings?.scheduleType == "client-by"){
    if(settings?.site?.delivery_time > 0){
      start.setDate(start.getDate() + Number(settings?.site?.delivery_time));
    }
  }
 
  const [startDate, setStartDate] = useState(null); 
  const { updateDeliveryTime, updateObs } = useCheckout();
  const handleOnChange = (date: any) => {
    setStartDate(date!);
    updateDeliveryTime(moment(date).format("DD-MM-YYYY HH:mm"));
    
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      updateObs(e.target.value);
      
  };

  const isWeekday = (date: Date) => {

    const day = date.getDay()

    var sunday = 8;
    var monday = 8;
    var tuesday = 8;
    var wednesday = 8;
    var thursday = 8;
    var friday = 8;
    var saturday = 8;


    if(settings?.schedule?.sunday != true){
      var sunday = 0;
    }
    if(settings?.schedule?.monday != true){
      var monday = 1;
    }
    if(settings?.schedule?.tuesday != true){
      var tuesday = 2;
    }
    if(settings?.schedule?.wednesday != true){
      var wednesday = 3;
    }
    if(settings?.schedule?.thursday != true){
      var thursday = 4;
    }
    if(settings?.schedule?.friday != true){
      var friday = 5;
    }
    if(settings?.schedule?.saturday != true){
      var saturday = 6;
    }
    

    return day !== sunday && day !== monday && day !== tuesday && day !== wednesday && day !== thursday && day !== friday && day !== saturday
  };

  
  return (
    <div className="py-8 px-4 lg:py-10 lg:px-8 xl:py-14 xl:px-16 2xl:px-20">
      <div className="flex flex-col lg:flex-row items-center lg:items-start m-auto lg:space-x-8 w-full max-w-5xl">
        <div className="lg:max-w-2xl w-full space-y-6">
          <div className="shadow-700 bg-white p-5 md:p-8">
            
            <Address
              id={data?.me?.id!}
              heading="Endereço de Entrega"
              addresses={data?.me?.address?.filter(
                (address: any) => address.type === "billing"
              )}
              count={1}
              type="billing"
            />
          </div>
          <p><small>Info (#1): Clique sobre o endereço para o selecionar</small></p>
          <div className="shadow-700 bg-white p-5 md:p-8"  style={{ display: "none" }}>
            <Address
              id={data?.me?.id!}
              heading="Endereço para Envio"
              addresses={data?.me?.address?.filter(
                (address: any) => address.type === "shipping"
              )}
              count={3}
              type="shipping"
            />
          </div>
          {settings?.scheduleType != "store"  && (
          <div className="shadow-700 bg-white p-5 md:p-8"  >


            <div className="flex items-center justify-between mb-5 md:mb-8">
                <div className="flex items-center space-x-3 md:space-x-4">
                  <span className="rounded-full w-8 h-8 bg-primary flex items-center justify-center text-base lg:text-xl text-white">2</span>
                  <p className="text-lg lg:text-xl text-heading ">Data de Entrega</p>
                </div>
            </div>
            <DatePicker 
             locale="ptBR"
             selected={startDate}
             minDate={start}
             showTimeSelect
             //dateFormat="dd/MM/yyyy"
             placeholderText="Escolha a Data & Hora"
             timeFormat="p"
             minTime={setHours(setMinutes(date, 0), 8)}
             maxTime={setHours(setMinutes(date, 45), 22)}
             timeIntervals={15}
             dateFormat="Pp"
             filterDate={isWeekday} 
             onChange={handleOnChange} 
             className="px-4 h-12 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-gray-300 focus:border-primary"/>

            <div style={{ display: "none" }} >
              <Schedule count={2}  />
            </div>
         
          </div>
          )}


        <div className="shadow-700 bg-white p-5 md:p-8"  >


            <div className="flex items-center justify-between mb-5 md:mb-8">
                <div className="flex items-center space-x-3 md:space-x-4">
                  <span className="rounded-full w-8 h-8 bg-primary flex items-center justify-center text-base lg:text-xl text-white">-</span>
                  <p className="text-lg lg:text-xl text-heading ">Notas & Instruções</p>
                </div>
            </div>
            <TextArea
              label="Observações"
              {...register("obs")}
              variant="outline"
              onChange={onInputChange}
              placeholder="Exemplo: Sem item, Item extra..."
              className="col-span-2"
            />

            </div>
        </div>

        <div className="w-full lg:w-96 mb-10 sm:mb-12 lg:mb-0 mt-10">
          <VerifyCheckout />
        </div>
      </div>
    </div>
  );
}
CheckoutPage.Layout = Layout;
