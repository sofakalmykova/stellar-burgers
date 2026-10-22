import { Preloader, IngredientDetailsUI } from '@ui';
import { useParams } from 'react-router-dom';
import { useSelector} from '../../services/store';
import { selectIngredients } from '@/services/slices/ingridients-slice';
export const IngredientDetails = (): React.JSX.Element => {
  // TODO: Взять переменную из стора
  const { id } = useParams<{ id: string }>();
  
  const ingredients = useSelector(selectIngredients);
  const ingredientData = ingredients.find((ingridient) => ingridient._id === id)
  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />
    
};    
  
