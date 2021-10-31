import cn from "classnames";
interface Props {
  text?: string;
  className?: string;
}

const NotFound: React.FC<Props> = (props) => {
  return (
    <div className={cn("flex flex-col items-center", props.className)}>
      <div className="w-full h-full flex items-center justify-center">
        <img
          src="/no-result.svg"
          alt="No result found"
          className="w-full h-full object-contain"
        />
      </div>
      <h3 className="w-full text-center text-xl font-semibold text-body my-7">
        {props.text}
      </h3>
    </div>
  );
};

export default NotFound;
