// migrations/20251106-remove-grade-from-workspaceUsers.js
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    // workspaceUsers.grade 컬럼 제거
    const tableDescription = await queryInterface.describeTable('workspaceUsers');
    
    if (tableDescription.grade) {
      await queryInterface.removeColumn('workspaceUsers', 'grade');
    } else {
      console.log('grade 컬럼이 이미 삭제되었습니다. 건너뜁니다.');
    }
  },
  
    async down(queryInterface, Sequelize) {
      // 롤백 시 grade 컬럼 복구 (원본 정의와 동일)
      await queryInterface.addColumn('workspaceUsers', 'grade', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 3,
        comment: '1:슈퍼 리더, 2:리더, 3:멤버, 4:지원자, 5:대기',
      });
    },
  };
  