import TrashIcon from "@components/icons/trash";
import Button from "@components/ui/button";

type ConfirmationCardProps = {
  onCancel: () => void;
  onDelete: () => void;
  title?: string;
  description?: string;
  cancelBtnText?: string;
  deleteBtnText?: string;
  cancelBtnLoading?: boolean;
  deleteBtnLoading?: boolean;
};

const ConfirmationCard: React.FC<ConfirmationCardProps> = ({
  onCancel,
  onDelete,
  title = "Apagar item",
  description = "Tem certeza de que deseja excluir este item?",
  cancelBtnText = "Cancelar",
  deleteBtnText = "Excluir",
  cancelBtnLoading,
  deleteBtnLoading,
}) => {
  return (
    <div className="p-4 pb-6 bg-white m-auto">
      <div className="w-full h-full text-center">
        <div className="flex h-full flex-col justify-between">
          <TrashIcon className="mt-4 w-12 h-12 m-auto text-primary" />
          <p className="text-gray-800 text-xl font-bold mt-4">{title}</p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed py-2 px-6">
            {description}
          </p>
          <div className="flex items-center justify-between space-x-4 w-full mt-8">
            <div className="w-1/2">
              <Button
                onClick={onCancel}
                loading={cancelBtnLoading}
                disabled={cancelBtnLoading}
                variant="custom"
                className="w-full py-2 px-4 bg-primary focus:outline-none hover:bg-primary-2 focus:bg-primary-2 text-white transition ease-in duration-200 text-center text-base font-semibold rounded shadow-md"
              >
                {cancelBtnText}
              </Button>
            </div>

            <div className="w-1/2">
              <Button
                onClick={onDelete}
                loading={deleteBtnLoading}
                disabled={deleteBtnLoading}
                variant="custom"
                className="w-full py-2 px-4 bg-red-600 focus:outline-none hover:bg-red-700 focus:bg-red-700 text-white transition ease-in duration-200 text-center text-base font-semibold rounded shadow-md"
              >
                {deleteBtnText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationCard;
