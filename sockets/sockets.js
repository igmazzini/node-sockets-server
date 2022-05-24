
const { io } = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands =  new Bands();


bands.addBand( new Band('Bersuit'));
bands.addBand( new Band('Patricio Rey'));
bands.addBand( new Band('La delio'));
bands.addBand( new Band('Divididos'));


//Mensajes de Sockets
io.on('connection', client => {    

    console.log('Cliente conectado');
    

    client.emit('active-bands',bands.getBands());


    client.on('disconnect', () => { 
        console.log('Cliente desconectado');
    });


    client.on('mensaje', ( data ) => { 
        console.log('Mensaje del cliente!!');
        console.log(data.msg);

        io.emit('mensaje',{msg:'Hola mundo desde el server'} );
        
    });

    client.on('server-message', ( data ) => {
        
        console.log('Server message ',data.msg);
       // io.emit('server-message',data );
    });

    client.on('client-message', ( data ) => {
        
        console.log('Client message ',data.msg);
        //io.emit('server-message',data );
       client.broadcast.emit('server-message',data );
    });

    client.on('vote-band', ( data ) => {
        
        console.log('Vote band ',data.id);
        bands.voteBand(data.id)
        //io.emit('server-message',data );
        io.emit('active-bands',bands.getBands() );
    });

    client.on('add-band', ( data ) => {
        
        console.log('Add band ',data.name);
        bands.addBand(new Band(data.name));
        //io.emit('server-message',data );
        io.emit('active-bands',bands.getBands() );
    });

    client.on('delete-band', ( data ) => {
        
        console.log('Delete band ',data.id);
        bands.deleteBand(data.id);
        //io.emit('server-message',data );
        io.emit('active-bands',bands.getBands() );
    });
   
});