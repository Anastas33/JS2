const fs = require('fs');
const cart = require('./cart');

const actions = {
    add: cart.add,
    change: cart.change,
    remove: cart.remove,
};

const handler = (req, res, action, file) => {
    fs.readFile(file, 'utf-8', (err, data) => {
        if (err) {
            res.sendStatus(404, JSON.stringify({result:0, text: err}));
        } else {
            const newCart = actions[action](JSON.parse(data), req);
            fs.writeFile(file, newCart, (err) => {
                if (err) {
                    res.send('{"result": 0}');
                } else {
                    res.send('{"result": 1}');
                }
            });
            fs.writeFile('./server/db/stats.json', data, (err) => {
                if (err) {
                    res.sendStatus(404, JSON.stringify({result: 0, text: err}));
                } else {
                    const find = JSON.parse(data).contents.find(el => el.id_product === +req.params.id);
                    res.write(JSON.stringify(`{object: ${find}}`));
                }
            });
        }
    });
};

module.exports = handler;