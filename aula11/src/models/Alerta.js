const mongoose = require('mongoose');

const alertaSchema = new mongoose.Schema({
	equipamentoId: {
		type: String,
		required: [true, 'O ID do equipamento é obrigatorio']
	},
	nivelSeveridade: {
		type: String,
		enum: ['BAIXO', 'MEDIO', 'CRITICO'],
		default: 'MEDIO'
	},
	temperaturaMedida: {
		type: Number,
		required: true
	},
	metadados: {
		type: Map,
		of: String
	},
	registradoEm: {
		type: Date,
		default: Date.now
	},
	tags: {
		type: [String],
		default: []
	}
}, {
	timestamps: true
});

module.exports = mongoose.model('Alerta', alertaSchema);
