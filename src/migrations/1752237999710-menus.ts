import { MigrationInterface, QueryRunner } from 'typeorm';

export class Menus1752237999710 implements MigrationInterface {
	name = 'Menus1752237999710';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE \`menu\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`path\` varchar(255) NOT NULL, \`component\` varchar(255) NOT NULL, \`icon\` varchar(255) NOT NULL, \`order\` int NOT NULL, \`acl\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`role_menus\` (\`menu_id\` int NOT NULL, \`role_id\` int NOT NULL, INDEX \`IDX_4c7c7bd4eb8a33aece58434cbf\` (\`menu_id\`), INDEX \`IDX_cec0c62317111ac45c9c295d22\` (\`role_id\`), PRIMARY KEY (\`menu_id\`, \`role_id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`ALTER TABLE \`role_menus\` ADD CONSTRAINT \`FK_4c7c7bd4eb8a33aece58434cbf5\` FOREIGN KEY (\`menu_id\`) REFERENCES \`menu\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
		);
		await queryRunner.query(
			`ALTER TABLE \`role_menus\` ADD CONSTRAINT \`FK_cec0c62317111ac45c9c295d226\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`role_menus\` DROP FOREIGN KEY \`FK_cec0c62317111ac45c9c295d226\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`role_menus\` DROP FOREIGN KEY \`FK_4c7c7bd4eb8a33aece58434cbf5\``,
		);
		await queryRunner.query(
			`DROP INDEX \`IDX_cec0c62317111ac45c9c295d22\` ON \`role_menus\``,
		);
		await queryRunner.query(
			`DROP INDEX \`IDX_4c7c7bd4eb8a33aece58434cbf\` ON \`role_menus\``,
		);
		await queryRunner.query(`DROP TABLE \`role_menus\``);
		await queryRunner.query(`DROP TABLE \`menu\``);
	}
}
