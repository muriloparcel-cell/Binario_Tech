const mongoose = require('mongoose');

const itemPecaSchema = new mongoose.Schema({
        nomePeca: { type: String, required: true },
        quantidade: { type: Number, required: true, default: 1, min: [1, 'A quantidade deve ser de no mínimo 1'] },
        custoUnitario: { 
                type: Number, 
                required: true, 
                min: [0, 'O custo unitário não aceita valores negativos'] 
        }
});

const manutencaoSchema = new mongoose.Schema({
        veiculoPlaca: { type: String, required: true, uppercase: true }, // Corrigido de upperCase para uppercase
        tipoManutencao: { 
                type: String, 
                enum: ['PREVENTIVA', 'CORRETIVA', 'EMERGENCIAL'], 
                default: 'PREVENTIVA'
        },
        custoTotal: { type: Number, required: true, min: [0, 'O custo total não aceita valores negativos'] },
        pecasSubstituidas: [itemPecaSchema],
        status: { 
                type: String, 
                enum: ['ABERTA', 'EM_ANDAMENTO', 'CONCLUIDA'], 
                default: 'ABERTA' 
        }
}, {
        timestamps: true
});

module.exports = mongoose.model('Manutencao', manutencaoSchema);
