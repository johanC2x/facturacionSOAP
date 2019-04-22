let express = require('express');
let router = express.Router();
let soap = require('soap');
let log4js = require('log4js');
let util = require('../util/util');
let constantes = require('../util/constantes');

log4js.configure({
	appenders: {
		app: {
			type: 'file', 
			filename: 'app.log' 
		} 
	},
	categories: { 
		default: {
			appenders: ['app'], 
			level: 'error' 
		} 
	}
});
let logger = log4js.getLogger('app');

router.get('/sendBill', (req, res, next) => {
    logger.error('============ INICIO METHOD [sendBill] ===================');
    let url = 'https://e-beta.sunat.gob.pe/ol-ti-itcpfegem-beta/billService?wsdl';
    let base64str = util.base64_encode(constantes.RUTA_ARCHIVOS_REQUEST + '20100066603-02-F002-2.zip', logger);
    let request = {
        "fileName": 'factura_00001_14042019.zip',
        "contentFile": base64str,
        "partyType": ''
    };
    soap.createClient(url, (err, client) => {
        client.addSoapHeader(`<Security>
                                <UsernameToken>
                                    <Username>20100066603MODDATOS</Username>
                                    <Password>moddatos</Password>
                                </UsernameToken>
                            </Security>`);
        if(err){
            logger.error('============== ERROR METHOD [sendBill] ===============');
            logger.error('Ha ocurrido el siguiente error => ' + err);
        }else{
            client.sendBill(request, (err, result) => {
                logger.error('REQUEST => ', client.lastRequest);
                if(err){
                    logger.error('============== ERROR METHOD [sendBill] ===============');
                    logger.error('Ha ocurrido el siguiente error => ' + err);
                    return res.send(400, {'success':false,'data' : []});
                }else{
                    logger.error('El servicio sendBill ha respondido => ' + JSON.stringify(result));
                    if(result.hasOwnProperty('fileName')){
                        util.base64_decode(result.contentFile ,constantes.RUTA_ARCHIVOS_REQUEST + '20100066603-02-F002-2-output.zip', logger);
                        res.send(200, {'success':true,'data' : result});
                    }else{
                        logger.error('============== EL SERVICIO [sendBill] HA RESPONDIDO ERROR ===============');
                        return res.send(400, {'success':false,'data' : []});
                    }
                }
            });
        }
    });
});

router.get('/wsasidepto', (req, res, next) => {
    logger.error('============ INICIO METHOD [test] ===================');
    let url = 'https://cvnet.cpd.ua.es/servicioweb/publicos/pub_gestdocente.asmx?wsdl';

    var request = {
        "plengua": 'C',
        "pcurso": '2011-12',
        "pcoddep": 'B142',
        "pcodest": ''
    };

    soap.createClient(url, function(err, client) {
        if(err){
            logger.error('============== ERROR METHOD [test => createClient] ===============');
            logger.error('Ha ocurrido el siguiente error => ' + err);
        }else{
            client.wsasidepto(request, function(err, result) {
                logger.error('REQUEST => ', client.lastRequest)
                if(err){
                    logger.error('============== ERROR METHOD [test => wsasidepto] ===============');
                    logger.error('Ha ocurrido el siguiente error => ' + err);
                    return res.send(400, {'success':false,'data' : []});
                }else{
                    logger.error('El servicio wsasidepto ha respondido => ' + JSON.stringify(result));
                    res.send(200, {'success':true,'data' : result});
                }
            });
        }
    });
});

module.exports = router;