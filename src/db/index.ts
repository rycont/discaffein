import Datastore from 'nedb-promises'
const DB = new Datastore({
    filename: 'bridgemap.db',
    autoload: true
})

export default DB