// import { createClient } from 'redis';

// const redisHost = process.env.REDIS_URL || 'redis-server';  // 'redis-server' Docker container hostname

// export const redisClient = createClient({
//   url: redisHost,
// });

// redisClient.on('error', (err) => console.error('Redis Client Error', err));
// redisClient.on('debug', (message) => {
//   console.log('Redis debug: ', message);
// });  

// export const connectRedis = async () => {
//   await redisClient.connect();
// };



import { createClient } from 'redis';

const redisHost = process.env.REDIS_URL || 'redis-server';  

export const redisClient = createClient({
  url: redisHost
  
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
  process.exit(1); 
});

redisClient.on('debug', (message) => {
  console.log('Redis debug: ', message);
});

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Redis Connected Successfully');
  } catch (err) {
    console.error('Failed to connect Redis:', err);
    process.exit(1);  
  }
};
