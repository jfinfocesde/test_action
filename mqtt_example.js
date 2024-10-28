const mqtt = require('mqtt');

// Configuración con más detalles
const options = {
  host: 'broker.emqx.io',
  port: 1883,
  clientId: `mqtt_${Math.random().toString(16).slice(3)}`,
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 1000,
};

const topic = 'pruebas1';
const message = '¡Hola desde Node.js!';

console.log('Intentando conectar a:', `mqtt://${options.host}:${options.port}`);

// Crear cliente
const client = mqtt.connect(`mqtt://${options.host}:${options.port}`, options);

// Manejar conexión
client.on('connect', () => {
  console.log('Conectado al broker MQTT');
  
  // Publicar mensaje con QoS 1
  const publishOptions = {
    qos: 1, // Garantiza la entrega
    retain: false
  };

  console.log('Intentando publicar mensaje...');
  
  client.publish(topic, message, publishOptions, (err) => {
    if (err) {
      console.error('Error al publicar:', err);
    } else {
      console.log(`Mensaje "${message}" enviado al tópico "${topic}" con QoS 1`);
    }
    
    // Esperar un momento antes de desconectar
    setTimeout(() => {
      client.end(true, () => {
        console.log('Desconectado del broker');
        process.exit(0);
      });
    }, 1000); // Espera 1 segundo antes de desconectar
  });
});

// Manejar errores
client.on('error', (error) => {
  console.error('Error de conexión:', error);
  process.exit(1);
});

// Verificar estado de la conexión
client.on('offline', () => {
  console.log('Cliente MQTT offline');
});

client.on('close', () => {
  console.log('Conexión MQTT cerrada');
});