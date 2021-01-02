import Datastore from 'nedb-promises'
const DB = new Datastore({
    filename: '../../dbstore',
    autoload: true
})
export default DB