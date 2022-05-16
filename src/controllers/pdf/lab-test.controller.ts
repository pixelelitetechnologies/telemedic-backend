/* eslint-disable no-useless-escape */
import Appointment from '../../db/models/appointment.model';
import pdf from 'html-pdf';
const Lab_Test = async (req, res) => {
    try {
        const { id } = req.query;

        let result = await Appointment.findById(id).populate('patient_details').populate('doctor_details');

        result = JSON.parse(JSON.stringify(result));

        console.log(result, '-****************-');
        const test_data = { name: result['doctor_details'].name, address: result['doctor_details'].current_practise_address[0].address, city: result['doctor_details'].current_practise_address[0].city, telephone:result['doctor_details'].phone, fax:result['doctor_details'].fax, health_card_no:'123' };

        console.log(test_data)

        res.render('generalTest', test_data, (err, data) => {
            
            if (!err) {
                console.log(data, '----------===========');
                const options = {
                    "height": "20in",
                    "width": "15in",
                    "header": {
                        "height": "20mm"
                    },
                    "footer": {
                        "height": "20mm",
                    },
                };
                pdf.create(data, options).toStream(function (err, data) {
                    console.log(err,'---', data, '===========');
                    if (err) {
                        res.status(400).send(err);
                    } else {
                        res.setHeader("Content-type", "application/pdf");
                        data.pipe(res);
                        // res.status(201).send("File created successfully");
                    }
                });
            }else{
                console.log(err,"error occurd")
                res.status(400).send(err);
            }
        })


    } catch (error) {
        res.status(400).json({
            status: false,
            type: 'error',
            message: error.message
        });
    }
}
export default Lab_Test