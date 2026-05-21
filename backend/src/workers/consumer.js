const supabase = require('../config/supabase');
const { consumeTask } = require('./rabbitmq');

async function processTask(task) {
  const { taskId, type, payload } = task;

  const { error: updateError } = await supabase
    .from('tasks')
    .update({ status: 'processing', updated_at: new Date().toISOString() })
    .eq('id', taskId);

  if (updateError) console.error('Failed to update task status:', updateError.message);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  let result = '';
  switch (type) {
    case 'email':
      result = `Email sent to ${payload.to || 'unknown'}: ${payload.subject || 'no subject'}`;
      break;
    case 'notification':
      result = `Notification sent: ${payload.message || 'no message'}`;
      break;
    case 'order_confirmation':
      result = `Order confirmation sent for order ${payload.orderId || 'unknown'}`;
      break;
    default:
      result = `Task of type "${type}" processed`;
  }

  console.log(result);

  const { error: completeError } = await supabase
    .from('tasks')
    .update({ status: 'completed', result, updated_at: new Date().toISOString() })
    .eq('id', taskId);

  if (completeError) console.error('Failed to update task completion:', completeError.message);
}

async function startConsumer() {
  console.log('Starting task consumer...');
  try {
    await consumeTask(processTask);
    console.log('Consumer is listening for tasks...');
  } catch (err) {
    console.error('Consumer failed to start:', err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  startConsumer();
}

module.exports = { processTask, startConsumer };
