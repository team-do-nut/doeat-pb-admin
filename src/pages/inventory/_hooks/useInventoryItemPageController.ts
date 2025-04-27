import { useCallback } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { PbItemTaxType, PbItemType, PostInventoryItemRequest } from '@src/api/pb/inventory/PbInventory.types';
import usePbInventoryPostItemMutation from '@src/api/pb/inventory/mutations/usePbInventoryPostItemMutation';
import usePbInventoryItemQuery from '@src/api/pb/inventory/queries/usePbInventoryItemQuery';
import { isValidEmpty } from '@src/utils/valid';

interface InventoryItemFormFields {
  itemData: {
    name: string;
    unit: string;
    type: PbItemType | '';
    taxType: PbItemTaxType | '';
  }[];
}

function useInventoryItemPageController() {
  const { register, control, handleSubmit } = useForm<InventoryItemFormFields>({
    defaultValues: {
      itemData: [
        {
          name: '',
          unit: '',
          type: '',
          taxType: '',
        },
      ],
    },
  });

  const {
    fields: itemDataFields,
    append: appendItemData,
    remove: removeItemData,
  } = useFieldArray({ control, name: 'itemData' });

  const allItemsQuery = usePbInventoryItemQuery();

  const { mutateAsync: postItem } = usePbInventoryPostItemMutation();

  const onItemAppendClick = useCallback(() => {
    appendItemData({ name: '', taxType: '', type: '', unit: '' });
  }, [appendItemData]);

  const onItemRemoveClick = useCallback(
    (index: number) => () => {
      if (itemDataFields.length <= 1) return;
      removeItemData(index);
    },
    [itemDataFields, removeItemData],
  );

  const onItemSubmit = useCallback<SubmitHandler<InventoryItemFormFields>>(
    ({ itemData }) => {
      if (itemData.some(({ name, taxType, type, unit }) => !isValidEmpty([name, taxType, type, unit]))) {
        alert('입력을 전부 채워주세요');
        return;
      }

      const transformedData: PostInventoryItemRequest[] = itemData.map(({ name, taxType, type, unit }) => ({
        name,
        taxType: taxType as PbItemTaxType,
        type: type as PbItemType,
        unit,
      }));

      postItem(transformedData);
    },
    [postItem],
  );

  return {
    register,
    control,
    handleSubmit,
    itemDataFields,
    allItemsQuery,
    onItemAppendClick,
    onItemRemoveClick,
    onItemSubmit,
  };
}

export default useInventoryItemPageController;
