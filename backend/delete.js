const Redis = require('ioredis');
require('dotenv').config();

const redisClient = new Redis({
  host: 'localhost',
  port: '6379',
});

async function deleteConversations() {
  try {
    const conversationsKey = 'messages';
    const exists = await redisClient.exists(conversationsKey);

    if (exists) {
      await redisClient.del(conversationsKey);
      console.log('Conversations deleted.');
    } else {
      console.log('No conversations found.');
    }
  } catch (error) {
    console.error('Error deleting conversations:', error);
  } finally {
    redisClient.quit();
  }
}

deleteConversations();
