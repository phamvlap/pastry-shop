import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

import { Wrapper, Button } from '~/components/index.js';

const ControlPanel = () => {
    const navigate = useNavigate();
    const toAddProduct = () => {
        navigate('/products/add');
    };
    return (
        <Wrapper padding={16} colorLevel="fourth">
            <Button primary leftIcon={<FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>} onClick={toAddProduct}>
                Thêm sản phẩm mới
            </Button>
        </Wrapper>
    );
};

export default ControlPanel;
