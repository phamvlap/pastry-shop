import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import { InputItem, Button } from '~/components/index.js';

const InputSearch = ({ placeholder, name, value, onChange }) => {
    return (
        <div className="input-group">
            <InputItem name={name} value={value} onChange={onChange} type="text" placeholder={placeholder} />
            <Button primary>
                <FontAwesomeIcon icon={faSearch} />
            </Button>
        </div>
    );
};

InputSearch.propTypes = {
    placeholder: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
};

export default InputSearch;
