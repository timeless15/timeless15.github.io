import dva from 'dva';
import './index.less';

// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./models/editor').default);
app.model(require('./models/screen').default);
app.model(require('./models/template').default);
app.model(require('./models/data').default);
app.model(require('./models/operator').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
