# RUNS ON FLASK
# python -m pip install flask

from flask import Flask, request, jsonify
# from .getSchedules import * #fucking jank ass python import
import psycopg2
import json
# from match_schedules import ScheduleBuildAndMatch
import numpy
app = Flask(__name__)


#returns a connection with the master account
#remove in final version and replace with some account that only has permission to make, delete, and update table entries in the officehours db
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

# previous function but better
def buildJoinedScheduleQuery(table):
    string = table + ".d1h1"
    for x in range(2, 13):
        string += ", " + table + ".d1h" + str(x)
    for x in range(2, 6):
        for y in range(1, 13):
            string += ", " + table + ".d" + str(x) + "h" + str(y)
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

#checks if some object exists in a table
# table: string, the table to look in
# where: string, the condition to specify the entry, format as "ATTRIBUTE=VALUE" or "ATT1=VAL1 and ATT2=VAL2"
def checkExists(table, where):
    cur = readConnect()
    cur.execute("select * from " + table + " where " + where + ";")
    if(cur.fetchone() == None):
        return False
    return True    

# checks a string for characters that may break the SQL or be used for SQL injection
def containsForbidden(string):
    if(not isinstance(string, str)):
        return True
    FORBIDDEN_CHAR = ["'", '"']
    for i in range(len(FORBIDDEN_CHAR)):
        if(string.find(FORBIDDEN_CHAR[i]) > -1):
            return True
    return False

#returns the schedules of a class
def getSchedules(classid, teacher):
    command = "select "
    # if(teacher == "true"):
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
    if(not checkExists(table, field + "=" + key)):
        return -1
    command = "update " + table + " set d1h1=" + str(schedule[0])
    x = 1
    for i in range(2,13):
        command += ",d1h" + str(i) + "=" + str(schedule[x])
        x+=1
    for i in range(2,6):
        for y in range(1, 13):
            command += ",d" + str(i) + "h" + str(y) + "=" + str(schedule[x])
    command += " where " + field + "=" + key + ";"
    # print(command)
    con = writeConnect()
    cur = con.cursor()
    # cur.execute("delete from userschedule where " + field + "=" + key + ";")
    cur.execute(command)
    con.commit()
    return 0

#sets a user's schedule
#UNTESTED
def setUserSchedule(email, schedule):
    return setSchedule("userschedule", "email", "'" + email + "'", schedule)

#sets class's hours
#UNTESTED
def setClassSchedule(classID, schedule):
    return setSchedule("classhours", "classid", str(classID), schedule)

#sets class's cached office hours
#UNTESTED
def setClassOfficeHours(classID, schedule):
    return setSchedule("classofficehourscache", "classid", str(classID), schedule)

#adds a user to the databases
# returns 0 on success
# returns -1 on failure due to email in use
def addUser(email, password):
    if(checkExists("users", "email='" + email + "'")):
        return -1
    con = writeConnect()
    cur = con.cursor()
    cur.execute("insert into users values ('" + email + "','" + password + "','');")
    cur.execute("insert into userschedule values ('" + email + "'," + stringEmptySchedule() + ");")
    con.commit()
    return 0

# sets an existing user's name to something new
# returns 0 on success
# returns -1 on failure due to no account found'
def setUserName(email, name):
    if(not checkExists("users", "email='" + email + "'")):
        return -1
    con = writeConnect()
    cur = con.cursor()
    cur.execute("update users set name='" + name + "';")
    con.commit()
    return 0

# adds a class to the databases
# returns 0 on success
# returns -1 on failure due to classID in use
def addClass(classID, name):
    if(checkExists("classes", "classid=" + str(classID))):
        return -1
    con = writeConnect()
    cur = con.cursor()
    cur.execute("insert into classes values (" + str(classID) + ",'" + name + "');")
    cur.execute("insert into classhours values (" + str(classID) + "," + stringEmptySchedule() + ");")
    cur.execute("insert into classofficehourscache values (" + str(classID) + "," + stringEmptySchedule() + ");")
    con.commit()
    return 0

# changes the name of a class
# returns 0 on success
# returns -1 on failure
def setClassName(classID, name):
    if(not checkExists("classes", "classid=" + str(classID))):
        return -1
    con = writeConnect()
    cur = con.cursor()
    cur.execute("update classes set name='" + name + "' where classid=" + str(classID) + ";")
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
def getUserDetails(email):
    cur = readConnect()
    cur.execute("select users.email,users.name," + buildJoinedScheduleQuery("userschedule") + " from users join userschedule on users.email=userschedule.email where users.email='" + email + "';")
    return cur.fetchone()

# returns the name of a user
# returns an empty string on failure
def getClassName(classID):
    cur = readConnect()
    cur.execute("select name from classes where classid=" + str(classID) + ";")
    ret = cur.fetchone()
    if(ret == None):
        return ""
    return ret[0]

def getClassDetails(classID):
    cur = readConnect()
    cur.execute("select classes.classid,classes.name," + buildJoinedScheduleQuery("classhours") + "," + buildJoinedScheduleQuery("classofficehourscache") + " from classes join classhours on classes.classid=classhours.classid join classofficehourscache on classes.classid=classofficehourscache.classid where classes.classid="+ str(classID) +";")
    return cur.fetchone()

#deletes a user from all relevent tables
#UNTESTED
def deleteUser(email):
    if(not checkExists("users", "email='" + email + "'")):
        return -1
    con = writeConnect()
    cur = con.cursor()
    cur.execute("delete from userschedule where email='" + email + "';")
    cur.execute("delete from userclasses where email='" + email + "';")
    cur.execute("delete from users where email='" + email + "';")
    con.commit()
    return 0

#deletes a class from all relevent tables
def deleteClass(classID):
    if(not checkExists("classes", "classid=" + classID)):
        return -1
    con = writeConnect()
    cur = con.cursor()
    cur.execute("delete from userclasses where classID=" + str(classID) + ";")
    cur.execute("delete from classhours where classID=" + str(classID) + ";")
    cur.execute("delete from classofficeHoursCache where classID=" + str(classID) + ";")
    cur.execute("delete from classes where classID=" + str(classID) + ";")
    con.commit()
    return 0

#adds a user to a class
def joinClass(email, classID, role):
    if(not checkExists("users", "email='" + email + "'")):
        return -1
    if(not checkExists("classes", "classid=" + str(classID))):
        return -1
    con = writeConnect()
    cur = con.cursor()
    cur.execute("insert into userclasses values ('" + email + "'," + str(classID) + "," + role + ");")
    con.commit()
    return 0

#removes a user from a class
def leaveClass(email, classID):
    if(not checkExists("users", "email='" + email + "'")):
        return -1
    if(not checkExists("classes", "classid=" + str(classID))):
        return -1
    con = writeConnect()
    cur = con.cursor()
    cur.execute("delete from userclasses where email='" + email + "' and classid=" + str(classID) + ";")
    con.commit()
    return 0

#changes the role of a user in a class
def changeMemberRole(email, classID, role):
    if(not checkExists("userclasses", "email='" + email + "' and classid=" + str(classID))):
        return -1
    con = writeConnect()
    cur = con.cursor()
    cur.execute("update userclasses set role=" + role + " where email='" + email + "' and classid=" + str(classID) + ";")
    return 0

#returns the classes a member is in and their role in them
def getUserClasses(email):
    cur = readConnect()
    cur.execute("select classid,role from userclasses where email='" + email +"';")
    return cur.fetchall()

#returns all the members of a class and their role in it
def getClassMembers(classID):
    cur = readConnect()
    cur.execute("select email,role from userclasses where classid=" + classID + ";")
    return cur.fetchall()

# ALGORITHM STUFF

class ScheduleBuildAndMatch:
    def __init__(self, teacher_array, num_office_hours):
        #Below are constants matched with states of time slots on schedule
        self.busy: int = 0
        self.free: int = 1
        self.lecture: int = 2
        self.assignment: int = 3
        self.exam: int = 4
        self.office_hours: int = 5
        
        self.number_office_hours_per_day = num_office_hours #number of office hours per day
        self.office_hours = [[0] *12 for _ in range(5)] #reset optimal office hours each time to properly overwrite data. Uses persitant counter.txt to set timeslots
        self.teacher_hours = teacher_array
        # self.fetch_counter() #set counter to counter.txt (converts txt to array)
        #set teacher schedule to teacher_schedule.txt (converts txt to array)
    
    #This is the algorithm. Uses numpy argpartition to find indexes of the n(number of office hours per day) highest elements in each day of the week of counter.txt
    def update_office_hours(self, counter):
        # self.fetch_counter() 
        self.match_with_teacher(counter)
        for i in range(5): #for each day of the week
            day_hours = numpy.argpartition(counter[i], -self.number_office_hours_per_day)[-self.number_office_hours_per_day:] #find indexes of n highest elements
            for j in range(self.number_office_hours_per_day): #for number of office hours per day
                self.office_hours[i][day_hours[j]] = 5   #set office_hours array at that timeslot of the n highest counter indicies to 5 (correlates to office hours)
        # self.save_office_hours() #save this array into office_hours.txt     
        return self.office_hours  
           
    #This is the function that increments counter based on teacher and student schedule
    def match_with_teacher(self, student_schedule):
        for i in range(5):#for each day of the week
            for j in range(12):#for each timeslot of each day
                if(self.teacher_hours[i][j] == 0): #if teacher and student are both available at a timeslot
                    student_schedule[i][j] = 0 #increment counter by 1 at this timeslot
        # self.save_counter() #save counter into counter.txt
    
    # def fetchCounter(self):
    #     return self.counter

def convertToArray(schedule):
    scheduleArray = [[None, [[0] *12 for _ in range(5)]]]
    for k in range(len(schedule)):
        if(k > 0):
            scheduleArray.append([None, [[0] *12 for _ in range(5)]])
        scheduleArray[k][0] = str(schedule[k][0])
        index = 1
        for i in range(5):
            for j in range(12):
                scheduleArray[k][1][i][j] = schedule[k][index]
                index += 1
    return scheduleArray

def convertToArrayCounter(schedule):
    array = [[],[],[],[],[]]
    i = 0
    for x in range(0, 5):
        for y in range(0, 12):
            array[x].append(schedule[i])
            i = i+1
            # print(i)
    # print(schedule[59])
    return array

def convertArrayToTuple(schedule):
    list = []
    for x in range(5):
        for y in range(12):
            list.append(schedule[x][y])
    return list


def FindOptimalOfficeHours(classID, numberOfficeHours):
    student_hours = genCounter(convertToArray(getStudentSchedules(classID)))
    teacher_hours = genCounter(convertToArray(getTeacherSchedules(classID)))
    # total_teacher_hours = [[0] * 12 for _ in range (5)]
    # for i in range(5):
    #     for j in range(12):
    #         total_teacher_hours[i][j] = 0
    #         for k in range(len(teacher_hours)):
    #             if(teacher_hours[k][1][i][j] == 1):
    #                 total_teacher_hours[i][j] = 1
    #                 break
    BuildSchedule = ScheduleBuildAndMatch(teacher_hours, numberOfficeHours)
    return BuildSchedule.update_office_hours(student_hours)

def buildEmptyCounter():
    counter = []
    for x in range(5):
        counter.append([])
        for y in range(12):
            counter[x].append(0)
    return counter

def genCounter(schedules):
    counter = buildEmptyCounter()
    for z in range(len(schedules)):
        for x in range(5):
            for y in range(12):
                counter[x][y] += (int)(schedules[z][1][x][y])
    return counter



# BACKEND TO FRONTEND COMMUNICATION BEGINS HERE
# RETURN VALUES:
#   0: SUCCESS
#   -1: FAILURE
#   -2: IMPROPER FORMATTING
#   PATCH requests return a json object containing the relevant attributes and a boolean for if it succeeded or not

# TODO: 
#     add authentication method to guard access to certain functions

# testdat = [
#     {"pee": "nus", "value":6}, 
#     {"pee": "pee", "value":9}, 
#     {"pee": "butt", "value":1}, 
#     {"pee": "poop", "value":7}, 
# ]
# # test function for testing
# @app.get("/pee/")
# def getPee():
#     return testdat

# @app.route("/pee/", methods=['POST'])
# def putPee():
#     # pee = request.args("TEST")
#     print(request.get_json())
#     return {1:1}

# @app.get("/pee/<urine>/")
# def piss(urine):
#     match urine:
#         case "poo":
#             return jsonify(1)
#         case _:
#             return jsonify(2)

# ACTUAL ENDPOINTS + FUNCTIONS

# handles user related stuff
@app.route('/users/', methods=['GET', 'POST', 'PATCH', 'DELETE'])
def U():
    req = request.get_json()
    if('email' not in req):
        return {"status":-2}
    if(containsForbidden(req['email'])):
        return {"status":-1}
    match request.method:
        case 'GET':
            if('data' not in req):
                return {"status":-2}
            match req['data']:
                case 'profile':
                    details = (getUserDetails(req['email']))
                    if(details == None):
                        return {"status":-1}
                    return {
                        "email": details[0],
                        "name": details[1],
                        "schedule":(details[2:15], details[15:27], details[27:39], details[39:51], details[51:62]),
                        "status":0
                        }
                case 'schedule':
                    details = getUserSchedule(req['email'])
                    if(details == None):
                        return {"status":-1}
                    return {
                        "schedule":(details[0:13], details[13:25], details[25:37], details[37:49], details[49:60]),
                        "status":0
                        }
                case 'name':
                    details = getUserName(req['email'])
                    if(details == None):
                        return {"status":-1}
                    return {
                        "name":details,
                        "status":0
                        }
                case _:
                    return {"status":-2}
        case 'POST':
            if('password' not in req):
                return {"status":-2}
            if(containsForbidden(req['password'])):
                return {"status":-1}
            return {"status":addUser(req['email'], req['password'])}
        case 'PATCH':
            ret = {"status":0}
            if "schedule" in req:
                #ADD req["schedule"] integer type check?
                if(setUserSchedule(req['email'], convertArrayToTuple(req['schedule'])) == 0):
                    ret['schedule'] = 0
                else:
                    ret['schedule'] = -1
                    ret["status"] = -1
            if 'name' in req:
                if(containsForbidden(req['name'])):
                    return {"status": -1}
                if(setUserName(req['email'], req['name']) == 0):
                    ret['name'] = 0
                else:
                    ret['name'] = -1
                    ret["status"] = -1
            return ret
        case 'DELETE':
            return {"status":deleteUser(req['email'])}
        case _:
            return {"status":-2}

# handles class related stuff
@app.route("/classes/", methods=['GET', 'POST', 'PATCH', 'DELETE'])
def C():
    req = request.get_json()
    if('id' not in req):
        return {"status":-2}
    if(not isinstance(req['id'], int)):
        return {"status":-1}
    match request.method:
        case 'GET':
            if('data' not in req):
                return {"status":-2}
            match req['data']:
                case 'all':
                    details = getClassDetails(req['id'])
                    if(details == None):
                        return {"status":-1}
                    return {
                        "classid": details[0],
                        "name": details[1],
                        "classhours":(details[2:15], details[15:27], details[27:39], details[39:51], details[51:63]),
                        "officehours":(details[63:75], details[75:87], details[87:99], details[99:111], details[111:123]),
                        "status":0
                    }
                case 'name':
                    details = getClassName(req['id'])
                    if(details == None):
                        return {"status":-1}
                    return {
                    "name":details,
                    "status":0
                    }
                case 'schedule':
                    details = getClassSchedule(req['id'])
                    if(details == None):
                        return {"status":-1}
                    return {
                        "schedule":(details[0:13], details[13:25], details[25:37], details[37:49], details[49:60]),
                        "status":0
                        }
                case 'officehours':
                    details = getClassOfficeHours(req['id'])
                    if(details == None):
                        return {"status":-1}
                    return {
                        "schedule":(details[0:13], details[13:25], details[25:37], details[37:49], details[49:60]),
                        "status":0
                        }
                case _:
                    return {"status":-2}
        case 'POST':
            if('name' not in req):
                return {"status":-2}
            if(containsForbidden(req['name'])):
                return {"status": -1}
            return {"status":addClass(req['id'], req['name'])}
        case 'PATCH':
            ret = {"status":0}
            if "schedule" in req:
                #ADD req["schedule"] integer type check?
                if(setClassSchedule(req['id'], convertArrayToTuple(req['schedule'])) == 0):
                    ret['schedule'] = 0
                else:
                    ret['schedule'] = -1
                    ret["status"] = -1
            if 'name' in req:
                if(containsForbidden(req['name'])):
                    ret['name'] = -1
                    ret["status"] = -1
                elif(setClassName(req['id'], req['name']) == 0):
                    ret['name'] = 0
                else:
                    ret['name'] = -1
                    ret["status"] = -1
            if('officehours' in req): # PART THAT THE ALGORITHM RUNS AT 
                #constant that controls how many office hours per day are generated
                OFFICEHOURSSLOTS = 4
                hours = FindOptimalOfficeHours(req['id'], OFFICEHOURSSLOTS)
                if(setClassOfficeHours(req['id'], convertArrayToTuple(hours)) == 0):
                    ret['officehours'] = hours
                else:
                    ret['officehours'] = -1
                    ret["status"] = -1
            return ret
        case 'DELETE':
            return {"status":deleteClass(ret['id'])}
        case _:
            return {"status":-2}

# handles stuff related to user-class pairs/entries in userclasses
@app.route("/users/classes/", methods=["GET", "POST", "PATCH", "DELETE"])
def UC():
    req = request.get_json()
    if("email" not in req):
        return {"status":-2}
    if(containsForbidden(req['email'])):
        return {"status": -1}
    match request.method:
        case "GET":
            details = getUserClasses(req["email"])
            if(details == None):
                return {"status":-1}
            return {
                "classes":details,
                "status":0
            }
        case "POST":
            if("id" not in req | "role" not in req):
                return {"status":-2}
            if(not isinstance(req['id'], int)):
                return {"status":-1}
            if(not isinstance(req['role'], bool)):
                return {"status":-1}
            return {"status":joinClass(req["email"], req["id"], req["role"])}
        case "PATCH":
            if("id" not in req | "role" not in req):
                return {"status":-2}
            if(not isinstance(req['id'], int)):
                return {"status":-1}
            return {"status":changeMemberRole(req["email"], req["id"], req["role"])}
        case "DELETE":
            if("id" not in req):
                return {"status":-2}
            if(not isinstance(req['id'], int)):
                return {"status":-1}
            return {"status":leaveClass(req["email"], req["id"])}
        case _:
            return {"status":-2}

# just for getting the members of a class
@app.route("/classes/students/", methods=["GET"])
# try:
#     cur.execute("select * from users where email=1;")#raises error and triggers catch block
#     print("fish")
# except:
#     print("balls")
def CS():
    req = request.get_json()
    if("id" not in req):
        return {"status":-2}
    if(not isinstance(req['id'], int)):
        return {"status":-1}
    match request.method:
        case "GET":
            details = getClassMembers(req["id"])
            # if(details == None): #if you have no members then its probably better to recieve a None rather than a 0 length array
            #     return {
            #         "members":[],
            #         "status":0
            #         }
            return {
                "members":details,
                "status":0
            }
        case _:
            return {"status":-2}
        

# cur = readConnect()
# try:
#     cur.execute("select * from users where email=1;")#raises error and triggers catch block
#     print("fish")
# except:
#     print("balls")