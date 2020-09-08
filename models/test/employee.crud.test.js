const Employee = require("../employee.model");
const expect = require("chai").expect;
const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer;
const mongoose = require("mongoose");

describe('Employee', () => {
    before(async () => {
        try {
            const fakeDB = new MongoMemoryServer();

            const uri = await fakeDB.getConnectionString();

            await mongoose.connect(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        } catch (err) {
            console.log(err);
        }
    });

    describe("Reading data", () => {
        before(async () => {
            const testEmploOne = new Employee({ 
                firstName: 'Amanda',
                lastName: 'Doe',
                department: 'IT'
            });
            await testEmploOne.save();

            const testEmploTwo = new Employee({ 
                firstName: 'Amanda',
                lastName: 'Doe',
                department: 'Marketing'
            });
            await testEmploTwo.save();
        });

        it('should return all the data with "find" method', async () => {
            const employees = await Employee.find();
            const expectedLength = 2;
            expect(employees.length).to.be.equal(expectedLength);
          });
      
          it('should return proper document by various params with "findOne" method.', async () => {
            const employee = await Employee.findOne({
              firstName: 'Amanda',
              lastName: 'Doe',
              department: 'IT'
            });
            expect(employee.firstName).to.be.equal('Amanda');
            expect(employee.lastName).to.be.equal('Doe');
            expect(employee.department).to.be.equal('IT');
          });

        after(async () => {
            await Employee.deleteMany();
        });
    });

    
    describe('Creating data', () => {

        it('should insert new document with "insertOne" method', async () => {
            const employee = new Employee({ 
                firstName: 'Amanda',
                lastName: 'Doe',
                department: 'Marketing'
            });
            await employee.save();
            expect(employee.isNew).to.be.false;
        });

      after(async () => {
        await Employee.deleteMany();
      });
    });

    describe('Updating data', () => {
        beforeEach(async () => {
          const testEmpOne = new Employee({
            firstName: 'Amanda',
            lastName: 'Doe',
            department: 'Marketing'
          });
          await testEmpOne.save();
    
          const testEmpTwo = new Employee({
            firstName: 'John',
            lastName: 'Doe',
            department: 'IT'
          });
          await testEmpTwo.save();
        });
    
        afterEach(async () => {
          await Employee.deleteMany();
        });
    
        it('should properly update one document with "updateOne" method', async () => {
          await Employee.updateOne({
            firstName: 'Amanda'
          }, {
            $set: {
              firstName: '=Amanda='
            }
          });
          const updatedEmployee = await Employee.findOne({
            firstName: '=Amanda='
          });
          expect(updatedEmployee).to.not.be.null;
        });

        it('should properly update one document with "save" method', async () => {
            const employee = await Employee.findOne({
              firstName: 'Amanda'
            });
            employee.firstName = '=Amanda=';
            await employee.save();
      
            const updatedEmployee = await Employee.findOne({
              firstName: '=Amanda='
            });
            expect(updatedEmployee).to.not.be.null;
          });
      
          it('should properly update multiple documents with "updateMany" method', async () => {
            await Employee.updateMany({}, {
              $set: {
                lastName: 'Done'
              }
            });
            const employees = await Employee.find();
            expect(employees[0].lastName).to.be.equal('Done');
            expect(employees[1].lastName).to.be.equal('Done');
          });
        });

        describe('Removing data', () => {
            beforeEach(async () => {
              const testEmpOne = new Employee({
                firstName: 'Amanda',
                lastName: 'Doe',
                department: 'Marketing'
              });
              await testEmpOne.save();
        
              const testEmpTwo = new Employee({
                firstName: 'John',
                lastName: 'Doe',
                department: 'IT'
              });
              await testEmpTwo.save();
            });
        
            afterEach(async () => {
              await Employee.deleteMany();
            });
        
            it('should properly remove one document with "deleteOne" method', async () => {
              await Employee.deleteOne({
                firstName: 'Amanda'
              });
              const removeEmployee = await Employee.findOne({
                firstName: 'Amanda'
              });
              expect(removeEmployee).to.be.null;
            });

            it('should properly remove one document with "remove" method', async () => {
                const employee = await Employee.findOne({
                  firstName: 'Amanda'
                });
                await employee.remove();
                const removeEmployee = await Employee.findOne({
                  firstName: 'Amanda'
                });
                expect(removeEmployee).to.be.null;
              });
          
              it('should properly remove multiple documents with "deleteMany" method', async () => {
                await Employee.deleteMany();
                const removeEmployee = await Employee.findOne({
                  firstName: 'Amanda'
                });
                const removeEmployeeTwo = await Employee.findOne({
                  firstName: 'John'
                });
                expect(removeEmployee).to.be.null;
                expect(removeEmployeeTwo).to.be.null;
              });
        });
});