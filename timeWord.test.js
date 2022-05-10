const timeWord = require('./timeWord');

describe('#timeword', () => {
  test('it is a function', () => {
    expect(typeof timeWord).toBe('function');
  });
  test('works: midnight and noon', () => {
    expect(timeWord('00:00')).toBe('midnight');
    expect(timeWord('12:00')).toBe('noon');
  });
  test('works: abbrev a.m.', () => {
    expect(timeWord('01:00')).toBe("one o'clock am");
  });
  test('works: abbrev p.m.', () => {
    expect(timeWord('06:01')).toBe('six oh one am');
    expect(timeWord('12:09')).toBe('twelve oh nine pm');
  });
  test('works: hours and minutes a.m.', () => {
    expect(timeWord('00:12')).toBe('twelve twelve am');
    expect(timeWord('06:10')).toBe('six ten am');
    expect(timeWord('06:18')).toBe('six eighteen am');
    expect(timeWord('06:30')).toBe('six thirty am');
    expect(timeWord('10:34')).toBe('ten thirty four am');
  });
  test('works: hours and minutes p.m.', () => {
    expect(timeWord('23:23')).toBe('eleven twenty three pm');
    expect(timeWord('15:55')).toBe('three fifty five pm');
  });
});