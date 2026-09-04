/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
	return knex.schema.createTable('motoristas', (table) => {
		table.increments('id').primary();
		table.string('nome').notNullable();
		table.string('cnh').notNullable().unique();
		table.string('categoria').notNullable();
		table.timestamps(true, true);
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
	return knex.schema.dropTableIfExists('motoristas');
};
