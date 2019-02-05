# Tianchen Qian
# 2019/2/5

# This code is to test the day-shifting part for primary hypothesis 2


find_change_location <- function(v){
    n <- length(v)
    if (n <= 1) {
        stop("The vector need to have length > 1.")
    }
    return(c(1, 1 + which(v[1:(n-1)] != v[2:n])))
}


shift_day <- function(
    dta,
    id_var = "userid",
    day_var = "Day",
    trt_var = "A",
    survey_completion_var,
    outcome_var = "Y",
    avail_var = NULL
) {
    # make sure survey_completion_var is binary
    stopifnot(all(dta[, survey_completion_var] %in% c(0, 1)))
    
    # make sure dta is sorted by id_var then day_var
    dta <- dta[order(dta[, id_var], dta[, day_var]), ]
    
    # create new_dta with shifted outcome (for day t, the outcome is Y_{t+1})
    new_dta <- dta
    new_dta$survey_completion_internal <- new_dta[, survey_completion_var]
    new_dta[1:(nrow(new_dta)-1), outcome_var] <- dta[2:nrow(dta), outcome_var]
    
    # remove the last observation for each individual (since there is no Y_{t+1} for the last day)
    person_first_index <- find_change_location(dta[, id_var])
    if (length(person_first_index) != length(unique(dta[, id_var]))) {
        stop("The length of person_first_index doesn't equal the number of unique id_var's.")
    }
    person_last_index <- c(person_first_index[-1] - 1, nrow(dta))
    new_dta <- new_dta[-person_last_index, ]
    
    # create avail_new, which is the product of both the original availability indicator
    # and the survey_completion_var
    if (is.null(avail_var)) {
        avail <- rep(1, nrow(new_dta))
    } else {
        avail <- new_dta[, avail_var]
    }
    new_dta$avail_new <- avail * new_dta$survey_completion_internal
    
    return(new_dta)
}


user1 <- data.frame(
    userid = rep(1, 5),
    Day  = 1:5,
    Y    = c(0,1,1,0,1)
)

user2 <- data.frame(
    userid = rep(2, 3),
    Day  = 1:3,
    Y    = c(1,1,1)
)

user3 <- data.frame(
    userid = rep(3, 3),
    Day  = 1:3,
    Y    = c(0,0,0)
)

user4 <- data.frame(
    userid = rep(4, 4),
    Day  = 1:4,
    Y    = c(1,1,0,0)
)

dta <- rbind(user1, user2, user3, user4)

new_dta <- shift_day(dta, survey_completion_var = "Y")



print(dta)

print(new_dta)

# check manually that all the following tests are passed for new_dta:
# (1) The last day of each individual is removed
# (2) Y_t equals Y_{t+1} in dta
# (3) avail_new is 1 only if the survey_completion_internal is 1
#     (because the estimand is defined conditional on "completed survey on current day")
