import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import { InputItem, Button } from '~/components/index.js';

const InputSearch = ({ placeholder }) => {
    return (
        <div className="input-group">
            <InputItem type="text" placeholder={placeholder} />
            <Button primary>
                <FontAwesomeIcon icon={faSearch} />
            </Button>
        </div>
    );
};

InputSearch.propTypes = {
    placeholder: PropTypes.string,
};

export default InputSearch;
