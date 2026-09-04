exports.seed = async function(knex) {
        // Limpa as tableas antes de popular
        await knex('telemetria').del();
        await knex('veiculos').del();

        // Inere veiculos de teste
        const [v3] = await knex('veiculos').insert({ placa: 'MER-3030', montadora: 'Mercedes-Benz', modelo: 'Sedan' });
        const [v4] = await knex('veiculos').insert({ placa: 'DAF-4040', montadora: 'DAF', modelo: 'DAF 33' });

        // Insere leituras iniciais de telemetria
        await knex('telemetria').insert([
                { veiculo_id: v3, velocidade: 83.1, temperatura_motor: 89.7 },
                { veiculo_id: v3, velocidade: 82.2, temperatura_motor: 88.4 },
                { veiculo_id: v4, velocidade: 93.0, temperatura_motor: 96.8
                }
        ]);
};
