import RadioGroup from "@components/ui/radio-group";
import { getColor } from "@utils/get-color";
import React from "react";

interface Props {
  variations: any;
  attributes: any;
  setAttributes: (key: any) => void;
}

const ProductAttributes = ({
  variations,
  attributes,
  setAttributes,
}: Props) => {
  if (!variations) return null;

  return (
    <>
      {Object.keys(variations).map((variationName, index) => (
       
        <div
          className="py-4 border-b border-gray-200  border-opacity-70 first:pt-0 flex items-center"
          key={index}
        > 
          <span className="text-sm font-semibold text-heading leading-none capitalize mr-4 min-w-[60px] inline-block">
          { variations[variationName][0].attribute?.name}
          :
          </span>

          <div className="w-full flex space-x-4 overflow-x-auto">
            {variations[variationName].map((attribute: any) => (
              <RadioGroup
                className={variationName}
                color={getColor(
                  attribute.meta ? attribute.meta : attribute?.value
                )}
                key={attribute.id}
                label={attribute.value}
                active={attributes[variationName] === attribute.value}
                onClick={() =>
                  setAttributes((prev: any) => ({
                    ...prev,
                    [variationName]: attribute.value,
                  }))
                }
              />
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default ProductAttributes;
