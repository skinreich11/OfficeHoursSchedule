import psycopg2

#returns a connection with the master account
#remove in final version
def connect():
    return psycopg2.connect(
        host = "database-1.cbvvlg2e7uis.us-east-2.rds.amazonaws.com",
        database = "office-hours",
        user = "fivestar",
        password = "O6OKCxDLB4Ij2zETe2Al")

#returns a read only connection to the database
# DO LATER
def readConnect():
    return connect().cursor()

#returns a writable connection to the database
# DO LATER
#not sure how to implement, is it pretty much just only access to the office-hours database+no ability to make/delete tables?
def writeConnect():
    return connect()

#builds the long ass string that I use to get only the hours out of the schedule tables
def buildScheduleQuery():
    string = "d1h1"
    for x in range(2, 13):
        string += ", d1h" + str(x)
    for x in range(2, 6):
        for y in range(1, 13):
            string += ", d" + str(x) + "h" + str(y)
    return string

#returns a empty schedule tuple since I don't want to have to copy that whole string multiple times
def emptySchedule():
    return (0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)

# returns a string of 60 zeros separated by commas
def stringEmptySchedule():
    string = "0"
    for i in range(59):
        string += ",0"
    return string

#returns the schedules of a class
def getSchedules(classid, teacher):
    command = "select"
    if(teacher == "true"):
        command += " userClasses.email,"
    command += buildScheduleQuery() + " from userClasses join userSchedule on userClasses.email=userSchedule.email where classID=" + str(classid) + " and role=" + teacher + ";"
    cur = readConnect()
    cur.execute(command)
    return cur.fetchall()

#returns all the student schedules of a class
def getStudentSchedules(classid):
    return getSchedules(classid, "false")

#returns all the teacher schedules of a class
def getTeacherSchedules(classid):
    return getSchedules(classid, "true")

#returns a user's schedule
def getUserSchedule(email):
    command = "select " + buildScheduleQuery() + " from userSchedule where email='" + email + "';"
    cur = readConnect()
    cur.execute(command)
    return cur.fetchone()

#returns a class's schedule/hours
def getClassSchedule(classID):
    cur = readConnect()
    cur.execute("select " + buildScheduleQuery() + " from classhours where classid=" + str(classID) + ";")
    return cur.fetchone()

# returns a class's office hours from the cache
def getClassOfficeHours(classID):
    cur = readConnect()
    cur.execute("select " + buildScheduleQuery() + " from classofficehourscache where classid=" + str(classID) + ";")
    return cur.fetchone()

#swaps out a schedule
#UNTESTED
def setSchedule(table, field, key, schedule):
    # command = "insert into " + table + " values " + field + "=(" + str(schedule[0])
    # for i in range(1, 60):
    #     command += "," + str(schedule[i])
    # command += ");"
    command = "update " + table + "set d1h1=" + str(schedule[0])
    x = 1
    for i in range(2,13):
        command += ",d1h" + str(i) + "=" + str(schedule[x])
        x+=1
    for i in range(2,6):
        for y in range(1, 13):
            command += ",d" + str(i) + "h" + str(y) + "=" + str(schedule[x])
    command += " where " + field + "=" + key + ";"
    con = writeConnect()
    cur = con.cursor()
    # cur.execute("delete from userschedule where " + field + "=" + key + ";")
    cur.execute(command)
    con.commit()
    return

#sets a user's schedule
#UNTESTED
def setUserSchedule(email, schedule):
    setSchedule("userschedule", "email", "'" + email + "'", schedule)
    return

#sets class's hours
#UNTESTED
def setClassSchedule(classID, schedule):
    setSchedule("classhours", "classid", str(classID), schedule)
    return

#sets class's cached office hours
#UNTESTED
def setClassOfficeHours(classID, schedule):
    setSchedule("classofficehourscache", "classid", str(classID), schedule)
    return

#adds a user to the databases
# returns 0 on success
# returns -1 on failure due to email in use
def addUser(email, password):
    con = writeConnect()
    cur = con.cursor()
    cur.execute("select * from users where email='" + email + "';")
    if(cur.fetchone() != None):
        return -1
    cur.execute("insert into users values ('" + email + "','" + password + "','');")
    cur.execute("insert into userschedule values ('" + email + "'," + stringEmptySchedule() + ");")
    con.commit()
    return 0

# sets an existing user's name to something new
# returns 0 on success
# returns -1 on failure due to no account found'
def setUserName(email, name):
    con = writeConnect()
    cur = con.cursor()
    cur.execute("select * from users where email='" + email + "';")
    if(cur.fetchone() == None):
        return -1
    cur.execute("update users set name='" + name + "';")
    con.commit()
    return 0

# adds a class to the databases
# returns 0 on success
# returns -1 on failure due to classID in use
def addClass(classID, name):
    con = writeConnect()
    cur = con.cursor()
    cur.execute("select * from classes where classid=" + str(classID) + ";")
    if(cur.fetchone() != None):
        return -1
    cur.execute("insert into classes values (" + str(classID) + ",'" + name + "');")
    cur.execute("insert into classhours values (" + str(classID) + "," + stringEmptySchedule() + ");")
    cur.execute("insert into classofficehourscache values (" + str(classID) + "," + stringEmptySchedule() + ");")
    con.commit()
    return 0

# returns the name of a user
# returns an empty string on failure
def getUserName(email):
    cur = readConnect()
    cur.execute("select name from users where email='" + email + "';")
    ret = cur.fetchone()
    if(ret == None):
        return ""
    return ret[0]

#returns all the details of a user needed to assemble their profile
#don't have enough details to make this function actually useful for now
def getUserDetails(email):
    cur = readConnect()
    cur.execute("select name from users where email='" + email + "';")
    return cur.fetchone()[0]

# returns the name of a user
# returns an empty string on failure
def getClassName(classID):
    cur = readConnect()
    cur.execute("select name from classes where classid=" + str(classID) + ";")
    ret = cur.fetchone()
    if(ret == None):
        return ""
    return ret[0]

#deletes a user from all relevent tables
#UNTESTED
def deleteUser(email):
    con = writeConnect()
    cur = con.cursor()
    cur.execute("delete from userschedule where email='" + email + "';")
    cur.execute("delete from userclasses where email='" + email + "';")
    cur.execute("delete from users where email='" + email + "';")
    con.commit()
    return

#deletes a class from all relevent tables
def deleteClass(classID):
    con = writeConnect()
    cur = con.cursor()
    cur.execute("delete from userclasses where classID=" + str(classID) + ";")
    cur.execute("delete from classhours where classID=" + str(classID) + ";")
    cur.execute("delete from classofficeHoursCache where classID=" + str(classID) + ";")
    cur.execute("delete from classes where classID=" + str(classID) + ";")
    con.commit()
    return

# subject = ""
# print(addUser("butt man", "Poophead"))
# print(getUserSchedule("butt man"))
# print(getUserName("butt man"))
# print(setUserName("butt man", "Poophead"))
# print(getUserName("butt man"))
# print(deleteUser("butt man"))
# print(getUserSchedule("butt man"))
# print(getUserName("butt man"))