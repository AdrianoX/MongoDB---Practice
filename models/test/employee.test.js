const Employee = require("../employee.model.js");
const expect = require("chai").expect;

describe("Employee", () => {
  it("should throw an error if no arg", () => {
    const employee = new Employee({}); // create new Employee, but don't set `name` attr value

    employee.validate((err) => {
      expect(err).to.exist;
    });
  });

  it('should throw an error if "firstName", "lastName", "department" is not a string', () => {
    const cases = [
      { firstName: 15, lastName: 44, department: 9 },
      { firstName: false, lastName: false, department: false },
      { firstName: true, lastName: true, department: true },
      { firstName: [], lastName: [], department: [] },
      { firstName: {}, lastName: {}, department: {} },
      { firstName: undefined, lastName: undefined, department: undefined },
      { firstName: "Amanda", lastName: "Doe", department: undefined },
      { firstName: "Amanda", lastName: "Doe", department: true },
      { firstName: "Amanda", lastName: "Doe", department: false },
      { firstName: "Amanda", lastName: "Doe", department: [] },
      { firstName: "Amanda", lastName: "Doe", department: {} },
    ];

    for (let name of cases) {
      const employee = new Employee({ name });

      employee.validate((err) => {
        expect(err).to.exist; 
      });
    }
  });
});