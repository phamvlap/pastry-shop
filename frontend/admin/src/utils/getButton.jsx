import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrashCan, faEye } from '@fortawesome/free-solid-svg-icons';

// get button from action name
const getButton = (action) => {
    let button = {};
    switch (action) {
        case 'detail':
            button['primary'] = true;
            button['leftIcon'] = <FontAwesomeIcon icon={faEye} />;
            break;
        case 'edit':
            button['warning'] = true;
            button['leftIcon'] = <FontAwesomeIcon icon={faPen} />;
            break;
        case 'delete':
            button['danger'] = true;
            button['leftIcon'] = <FontAwesomeIcon icon={faTrashCan} />;
            break;
    }
    return button;
};

export default getButton;
