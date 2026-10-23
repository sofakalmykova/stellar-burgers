import { BurgerConstructorElementUI } from '@ui';
import { memo } from 'react';
import { useDispatch } from '@/services/store';
import type { BurgerConstructorElementProps } from './type';
import { moveDown, moveUp, removeIngredient } from '@/services/slices/constructor-slice';
export const BurgerConstructorElement = memo(function BurgerConstructorElement({
  ingredient,
  index,
  totalItems,
}: BurgerConstructorElementProps): React.JSX.Element {
  const dispatch = useDispatch();
  const handleMoveDown = (): void => {
    dispatch(moveDown(ingredient.id));
    // TODO
  };

  const handleMoveUp = (): void => {
    dispatch(moveUp(ingredient.id));
    // TODO
  };

  const handleClose = (): void => {
    dispatch(removeIngredient(ingredient.id));
    // TODO
  };

  return (
    <BurgerConstructorElementUI
      ingredient={ingredient}
      index={index}
      totalItems={totalItems}
      handleMoveUp={handleMoveUp}
      handleMoveDown={handleMoveDown}
      handleClose={handleClose}
    />
  );
});
