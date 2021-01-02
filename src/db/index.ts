import Datastore from 'nedb-promises'
const DB = new Datastore({
    filename: 'channelmap.db',
    autoload: true
})

export default DB