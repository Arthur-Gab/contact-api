import builder from './builder';

// Import all Models here
import './model/errors';
import './model/contacts';

const schema = builder.toSchema();
export default schema;
