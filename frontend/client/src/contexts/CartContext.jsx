import { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

import { UserContext } from '~/contexts/UserContext.jsx';
import CartActions from '~/utils/cartActions.js';

const CartContext = createContext();

const CartProvider = ({ children }) => {
    const [quantityInCart, setQuantityInCart] = useState(0);
    const { user } = useContext(UserContext);

    const fetchCart = async () => {
        try {
            const response = await CartActions.getCart();
            if (response.status === 'success') {
                const quantity = response.data.reduce((result, item) => {
                    return result + Number(item.quantityInCart);
                }, 0);
                setQuantityInCart(quantity);
            }
        } catch (err) {
            setQuantityInCart(0);
        }
    };

    useEffect(() => {
        if (user) {
            fetchCart();
        }
    }, [user]);

    return <CartContext.Provider value={{ quantityInCart, setQuantityInCart }}>{children}</CartContext.Provider>;
};

CartProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { CartContext };
export default CartProvider;
