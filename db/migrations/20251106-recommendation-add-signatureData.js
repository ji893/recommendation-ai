// migrations/20251105-alter-recommendation-add-signatureData.js

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 컬럼이 이미 존재하는지 확인
    const tableDescription = await queryInterface.describeTable('recommendation');
    
    if (!tableDescription.signatureData) {
      await queryInterface.addColumn(
        'recommendation',
        'signatureData',
        {
          type: Sequelize.TEXT('long'), // LONGTEXT
          allowNull: true,
        },
        {
          // MySQL 전용: 컬럼 배치 위치
          after: 'content',
        }
      );
    } else {
      console.log('signatureData 컬럼이 이미 존재합니다. 건너뜁니다.');
    }
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('recommendation', 'signatureData');
  },
};
