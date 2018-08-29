# Tianchen Qian, 2018/8/29
# Based on SARAanalysis_20180824.R, added availability.

# the availability indicator is always multiplied with the residual r := Y - exp(alpha*Z + beta*X)
# in estimating function and in asymptotic variance calculation


library(rootSolve) # for solver function multiroot()

binary_outcome_moderated_effect <- function(
        dta,
        control_var,
        moderator,
        id_var,
        day_var = "Day",
        max_days = 30,
        trt_var = "A",
        outcome_var = "Y",
        avail_var = NULL,
        prob_treatment = 1/2,
        significance_level = 0.025,
        no_intercept_for_moderator = FALSE)
{
    ############## description ###############
    ##
    ## This function estimates the moderated treatment effect for binary outcome,
    ## and provides variance estimate, test statistics (t-test and F-test), and p-values.
    ##
    ## It incorporates two methods for small sample correction:
    ## 1) the usage of "Hat" matrix in the variance estimate (as in Mancl & DeRouen 2001)
    ## 2) the usage of t-distribution or F-distribution critical value with corrected degrees of freedom
    ##    (as in Liao et al. 2015)
    ##
    ## It is used as an internal function for SARA analysis wrapper functions.
    
    ############## arguments ###############
    ##
    ## dta.............the data set in long format
    ## control_var...........vector of variable names used to reduce noise (Z in the model),
    ##                       could be NULL (no control covariates)
    ## moderator.............vector of variable names as effect modifiers (X in the model),
    ##                       could be NULL (no effect modifier)
    ## id_var................variable name for subject id (to distinguish between subjects in dta)
    ## day_var...............variable name for day in study (from 1 to max_days)
    ## max_days..............maximum of days observed for a participant
    ## trt_var...............variable name for treatment indicator
    ## outcome_var...........variable name for outcome variable
    ## avail_var.............variable name for availability variable
    ##                       NULL (default) means always-available
    ## prob_treatment........probability of treatment (default to 1/2)
    ## significance_level....significance level for the hypothesis testing (default to 0.025)
    ## no_intercept_for_moderator.....whether to add intercept to the moderator


    ############## return value ###############
    ##
    ## This function returns a list of the following components:
    ##
    ## beta_hat..............estimated beta
    ## alpha_hat.............estimated alpha
    ## beta_se...............standard error for beta_hat
    ## alpha_se..............standard error for alpha_hat
    ## beta_se_ssa...........standard error for beta_hat, with small sample correction (hat matrix)
    ## alpha_se..............standard error for alpha_hat, with small sample correction (hat matrix)
    ## test_result_t.........(one-sided) t-test result for each entry in beta_hat, which is a list consisting of test_stat, critical_value, p_value
    ## test_result_f.........F-test result for beta = 0, which is a list consisting of test_stat, critical_value, p_value
    ## varcov................estimated variance-covariance matrix for (beta_hat, alpha_hat)
    ## varcov_ssa............estimated variance-covariance matrix for (beta_hat, alpha_hat), with small sample correction (hat matrix)
    ## dims..................a list of p (dim of moderator) and q (dim of control_var), which includes the intercepts if added


    ############## part 1 :: preparation ###############
    
    # make sure every subject has max_days observations
    stopifnot(all(aggregate(dta[, day_var] ~ dta[, id_var], dta, length)[, 2] == max_days))
    
    # gather variables
    A <- dta[, trt_var]
    cA <- A - prob_treatment # centered A
    if (no_intercept_for_moderator) {
        Xdm <- as.matrix( dta[, moderator] )    # X design matrix, no intercept
    } else {
        Xdm <- as.matrix( cbind( rep(1, nrow(dta)), dta[, moderator] ) )   # X design matrix, intercept added
    }
    Zdm <- as.matrix( cbind( rep(1, nrow(dta)), dta[, control_var] ) ) # Z design matrix, intercept added
    Y <- dta[, outcome_var]
    
    n <- sample_size <- length(unique(dta[, id_var]))
    
    if (is.null(avail_var)) {
        avail <- rep(1, sample_size * max_days)
    } else {
        avail <- dta[, avail_var]
    }
    
    p <- ncol(Xdm) # dimension of beta
    q <- ncol(Zdm) # dimension of alpha
    
    if (no_intercept_for_moderator) {
        Xnames <- moderator
    } else {
        Xnames <- c("Intercept", moderator)
    }
    
    Znames <- c("Intercept", control_var)
    

    ############## part 2 :: estimate beta and alpha ###############
    
    estimating_function <- function(theta) {
        # function to be used in solver
        # theta is a vector of length: length(control_var) + 2
        beta <- as.matrix(theta[1:p])
        alpha <- as.matrix(theta[(p+1):(p+q)])
        
        exp_Zdm_alpha <- exp(Zdm %*% alpha)
        exp_negAXdm_beta <- exp(- A * (Xdm %*% beta))
        residual <- Y * exp_negAXdm_beta - exp_Zdm_alpha
        
        ef <- rep(NA, length(theta)) # value of estimating function
        for (i in 1:p) {
            ef[i] <- sum( residual * avail * cA * Xdm[, i])
        }
        for (i in 1:q) {
            ef[p + i] <- sum( residual * avail * exp_Zdm_alpha * Zdm[, i])
        }
        
        ef <- ef / sample_size
        return(ef)
    }
    
    # if come across solver error, try change the initial values here
    beta_initial <- rep(0, p)
    alpha_initial <- rep(0, q)
    root <- multiroot(estimating_function, c(beta_initial, alpha_initial), useFortran = FALSE)
    if (p == 1) {
        beta_root <- root$root[1]
    } else {
        beta_root <- as.matrix(root$root[1:p])
    }
    if (q == 1) {
        alpha_root <- root$root[(p+1):(p+q)]
    } else {
        alpha_root <- as.matrix(root$root[(p+1):(p+q)])
    }
    
 
    ############## part 3 :: estimate standard error by asymptotics ###############
    
    # Compute M_n matrix (M_n is the empirical expectation of the derivative of the estimating function)

    Mn_summand <- array(NA, dim = c(sample_size * max_days, p+q, p+q))
    for (it in 1:nrow(dta)) {

        # this is to make R code consistent whether X_it, Z_it contains more entries or is just 1.        
        if (p == 1) {
            Xbeta <- Xdm[it, ] * beta_root
        } else {
            Xbeta <- Xdm[it, ] %*% beta_root
        }
        if (q == 1) {
            Zalpha <- Zdm[it, ] * alpha_root
        } else {
            Zalpha <- Zdm[it, ] %*% alpha_root
        }
        
        exp_Zalpha <- as.vector(exp(Zalpha))
        exp_negAXbeta <- as.vector(exp(- A[it] * Xbeta))
        exp_2Zalpha <- as.vector(exp(2 * Zalpha))
        # browser()
        Mn_summand[it, 1:p, 1:p] <-
            - as.numeric(Y[it] * exp_negAXbeta * A[it] * cA[it]) * (Xdm[it, ] %o% Xdm[it, ]) * avail[it]
        Mn_summand[it, 1:p, (p+1):(p+q)] <-
            - as.numeric(cA[it] * exp_Zalpha) * (Xdm[it, ] %o% Zdm[it, ]) * avail[it]
        Mn_summand[it, (p+1):(p+q), 1:p] <-
            - as.numeric(Y[it] * exp_negAXbeta * A[it] * exp_Zalpha) * (Zdm[it, ] %o% Xdm[it, ]) * avail[it]
        Mn_summand[it, (p+1):(p+q), (p+1):(p+q)] <-
            as.numeric(Y[it] * exp_negAXbeta * exp_Zalpha - 2 * exp_2Zalpha) * (Zdm[it, ] %o% Zdm[it, ]) * avail[it]
    }
    Mn <- apply(Mn_summand, c(2,3), sum) / sample_size
    Mn_inv <- solve(Mn)
    
    # Compute \Sigma_n matrix (\Sigma_n is the empirical variance of the estimating function)

    exp_Zdm_alpha <- exp(Zdm %*% alpha_root)
    exp_negAXdm_beta <- exp(- A * (Xdm %*% beta_root))
    residual <- Y * exp_negAXdm_beta - exp_Zdm_alpha
    Sigman_summand <- matrix(NA, nrow = sample_size * max_days, ncol = p+q)
    for (i in 1:p) {
        Sigman_summand[, i] <- residual * avail * cA * Xdm[, i]
    }
    for (i in 1:q) {
        Sigman_summand[, p+i] <- residual * avail * exp_Zdm_alpha * Zdm[, i]
    }
    
    Sigman <- matrix(0, nrow = p+q, ncol = p+q)
    for (user in 1:sample_size) {
        summand <- Sigman_summand[((user-1)*max_days+1):(user*max_days), ]
        summand <- colSums(summand)
        summand <- summand %o% summand
        Sigman <- Sigman + summand
    }
    Sigman <- Sigman / sample_size
    
    # Compute the asymptotic variance matrix
    
    asymp_varcov <- Mn_inv %*% Sigman %*% t(Mn_inv)
    asymp_var <- diag(asymp_varcov)
    
    # get the standard error for beta and alpha from the asymptotic variance matrix

    beta_se <- sqrt(asymp_var[1:p] / sample_size)
    alpha_se <- sqrt(asymp_var[(p+1):(p+q)] / sample_size)
    

    ############## part 4 :: estimate standard error with small sample correction ###############
    
    # construct the new "meat" in the sandwich estimator (to replace \Sigma_n)

    meat <- 0
    for (user in 1:sample_size) {
        # preparation
        A_user <- A[((user-1)*max_days+1):(user*max_days)] # A_i1 to A_iT
        cA_user <- cA[((user-1)*max_days+1):(user*max_days)] # centered A
        Xdm_user <- Xdm[((user-1)*max_days+1):(user*max_days), ] # X_i1 to X_iT
        Zdm_user <- Zdm[((user-1)*max_days+1):(user*max_days), ] # Z_i1 to Z_iT
        Y_user <- Y[((user-1)*max_days+1):(user*max_days)] # Y_i1 to Y_iT
        avail_user <- avail[((user-1)*max_days+1):(user*max_days)]
        
        # this is to make R code consistent whether X_it, Z_it contains more entries or is just 1.    
        if (p == 1) {
            Xbeta <- Xdm_user * beta_root
        } else {
            Xbeta <- Xdm_user %*% beta_root
        }
        if (q == 1) {
            Zalpha <- Zdm_user * alpha_root
        } else {
            Zalpha <- Zdm_user %*% alpha_root
        }
        
        exp_Zalpha_plus_AXbeta <- as.vector(exp(Zalpha + A_user * Xbeta))
        exp_Zalpha_minus_AXbeta <- as.vector(exp(Zalpha - A_user * Xbeta))
        exp_negAXbeta <- as.vector(exp(- A_user * Xbeta))
        
        # compute r_i
        r_i <- matrix((Y_user - exp_Zalpha_plus_AXbeta) * avail_user)
        
        # compute D_i
        D_i <- cbind( exp_negAXbeta * cA_user * Xdm_user, exp_Zalpha_minus_AXbeta * Zdm_user )
        # exp_Zalpha_minus_AXbeta * Xdm_user: multiply the vector exp_Abeta_plus_Xalpha to each column of Xdm_user
        
        # compute partial_e_i/partial_theta
        de_i <- cbind( - exp_Zalpha_plus_AXbeta * A_user * Xdm_user * avail_user,
                           - exp_Zalpha_plus_AXbeta * Zdm_user * avail_user )
        
        # compute H_i
        H_i <- de_i %*% Mn_inv %*% t(D_i) / sample_size
        
        Ii_minus_Hi_inv <- solve(diag(max_days) - H_i)
        meat <- meat + t(D_i) %*% Ii_minus_Hi_inv %*% r_i %*% t(r_i) %*% t(Ii_minus_Hi_inv) %*% D_i
    }
    meat <- meat / sample_size
    
    # calculate asymptotic variance with small sample adjustment
    # "ssa" stands for small sample adjustment

    asymp_varcov_ssa <- Mn_inv %*% meat %*% t(Mn_inv)
    asymp_var_ssa <- diag(asymp_varcov_ssa)
    
    beta_se_ssa <- sqrt(asymp_var_ssa[1:p] / sample_size)
    alpha_se_ssa <- sqrt(asymp_var_ssa[(p+1):(p+q)] / sample_size)
    
    
    ############## part 5 :: p-value with small sample correction ###############
    
    # t test (one sided, because we are using significance_level instead of significance_level/2)
    
    test_stat <- beta_root / beta_se_ssa
    critical_value <- qt(1 - significance_level, df = n - 1 - q)
    p_val <- pt(abs(test_stat), df = n - 1 - q, lower.tail = FALSE)
    names(test_stat) <- names(p_val) <- Xnames
    test_result_t <- list(test_stat = test_stat,
                          critical_value = critical_value,
                          p_value = p_val)
    
    # F test (two sided, by the nature of F-test)

    test_stat <- as.numeric( t(beta_root) %*% solve(asymp_varcov_ssa[1:p, 1:p] / sample_size) %*% beta_root )
    n <- sample_size
    critical_value <- qf((n-q-p) * (1-significance_level) / (p * (n-q-1)), df1 = p, df2 = n-q-p)
    p_val <- pf(test_stat, df1 = p, df2 = n-q-p, lower.tail = FALSE)
    test_result_f <- list(test_stat = test_stat,
                         critical_value = critical_value,
                         p_value = p_val)
    
    ############## part 6 :: return the result with variable names ###############
    
    beta_hat <- as.vector(beta_root)
    names(beta_hat) <- names(beta_se) <- names(beta_se_ssa) <- Xnames
    alpha_hat <- as.vector(alpha_root)
    names(alpha_hat) <- names(alpha_se) <- names(alpha_se_ssa) <- Znames
    
    return(list(beta_hat = beta_hat, alpha_hat = alpha_hat,
                beta_se = beta_se, alpha_se = alpha_se,
                beta_se_ssa = beta_se_ssa, alpha_se_ssa = alpha_se_ssa,
                test_result_t = test_result_t,
                test_result_f = test_result_f,
                varcov = asymp_varcov / sample_size,
                varcov_ssa = asymp_varcov_ssa / sample_size,
                dims = list(p = p, q = q)))
}



SARA_primary_hypothesis_1 <- function(
    dta,
    control_var,
    id_var = "userid",
    day_var = "Day",
    trt_var = "A",
    outcome_var = "Y",
    avail_var = NULL,
    prob_treatment = 1/2,
    significance_level = 0.025
) {
    ############## description ###############
    ##
    ## This function tests for primary hypothesis 1 for SARA:
    ## H0: The 4pm push notification with inspirational quote will
    ## increase the full completion of survey and/or active
    ## task the same day as compared to no inspirational quote.
    ##
    ## For more details, refer to the writeup for SARA analysis.
    
    ############## arguments ###############
    ##
    ## dta.............the data set in long format
    ## control_var...........vector of variable names used to reduce noise (Z in the model),
    ##                       could be NULL (no control covariates)
    ## id_var................variable name for subject id (to distinguish between subjects in dta)
    ## day_var...............variable name for day in study (from 1 to max_days)
    ## max_days..............maximum of days observed for a participant
    ## trt_var...............variable name for treatment indicator
    ## outcome_var...........variable name for outcome variable
    ## avail_var.............variable name for availability variable
    ##                       NULL (default) means always-available
    ## prob_treatment........probability of treatment (default to 1/2)
    ## significance_level....significance level for the hypothesis testing (default to 0.025)

    ############## return value ###############
    ##
    ## This function returns a list of the following components:
    ##
    ## beta..................estimated beta (marginal treatment effect)
    ## beta_se...............standard error for beta, with small sample correction
    ## test_stat.............(one sided) t-test statsitic for testing beta = 0
    ## critical_value........(one sided) critical value for t-test with the input significance level 
    ## p_value...............(one sided) p-value for t-test

        
    # make sure dta is sorted by id_var then day_var
    dta <- dta[order(dta[, id_var], dta[, day_var]), ]
    
    result <- binary_outcome_moderated_effect(dta = dta,
                                              control_var = control_var,
                                              moderator = NULL,
                                              id_var = id_var,
                                              day_var = day_var,
                                              max_days = 30,
                                              trt_var = trt_var,
                                              outcome_var = outcome_var,
                                              avail_var = avail_var,
                                              prob_treatment = prob_treatment,
                                              significance_level = significance_level,
                                              no_intercept_for_moderator = FALSE)
    output <- list(beta = as.numeric(result$beta_hat),
                   beta_se = as.numeric(result$beta_se_ssa),
                   test_stat = as.numeric(result$test_result_t$test_stat),
                   critical_value = result$test_result_t$critical_value,
                   p_value = as.numeric(result$test_result_t$p_value))
    return(output)
}



SARA_primary_hypothesis_2 <- function(
    dta,
    control_var,
    id_var = "userid",
    day_var = "Day",
    trt_var = "A",
    survey_completion_var,
    outcome_var = "Y",
    avail_var = NULL,
    prob_treatment = 1/2,
    significance_level = 0.025
) {
    
    ############## description ###############
    ##
    ## This function tests for primary hypothesis 2 for SARA:
    ## H0: Among individuals who complete the survey, providing a post-survey-completion
    ## meme or gif will not yield a higher rate of completion of
    ## the survey or active task the next day than not providing meme/gif
    ## reinforcement after survey completion.
    ##
    ## For more details, refer to the writeup for SARA analysis.
    
    ############## arguments ###############
    ##
    ## dta.............the data set in long format
    ## control_var...........vector of variable names used to reduce noise (Z in the model),
    ##                       could be NULL (no control covariates)
    ## id_var................variable name for subject id (to distinguish between subjects in dta)
    ## day_var...............variable name for day in study (from 1 to max_days)
    ## max_days..............maximum of days observed for a participant
    ## trt_var...............variable name for treatment indicator
    ## survey_completion_var......variable name for the survey completion indicator of each day (I_{it} in the writeup)
    ## outcome_var...........variable name for outcome variable
    ## avail_var.............variable name for availability variable
    ##                       NULL (default) means always-available
    ## prob_treatment........probability of treatment (default to 1/2)
    ## significance_level....significance level for the hypothesis testing (default to 0.025)
    
    ############## return value ###############
    ##
    ## This function returns a list of the following components:
    ##
    ## beta..................estimated beta (marginal treatment effect)
    ## beta_se...............standard error for beta, with small sample correction
    ## test_stat.............(one sided) t-test statsitic for testing beta = 0
    ## critical_value........(one sided) critical value for t-test with the input significance level 
    ## p_value...............(one sided) p-value for t-test
    
    # make sure survey_completion_var is binary
    stopifnot(all(dta[, survey_completion_var] %in% c(0, 1)))
    
    # make sure dta is sorted by id_var then day_var
    dta <- dta[order(dta[, id_var], dta[, day_var]), ]
    
    # create new_dta with shifted outcome (for day t, the outcome is Y_{t+1})
    new_dta <- dta
    new_dta[1:(nrow(new_dta)-1), outcome_var] <- dta[2:nrow(dta), outcome_var]
    
    # remove the observations on day 30 (since there is no Y_{t+1} for day t = 30)
    new_dta <- new_dta[new_dta[, day_var] != 30, ]
    
    for (varname in control_var) {
        new_dta[, varname] <- new_dta[, varname] * new_dta[, survey_completion_var]
    }
    
    result <- binary_outcome_moderated_effect(dta = new_dta,
                                              control_var = control_var,
                                              moderator = survey_completion_var,
                                              id_var = id_var,
                                              day_var = day_var,
                                              max_days = 29,
                                              trt_var = trt_var,
                                              outcome_var = outcome_var,
                                              avail_var = avail_var,
                                              prob_treatment = prob_treatment,
                                              significance_level = significance_level,
                                              no_intercept_for_moderator = TRUE)
    output <- list(beta = as.numeric(result$beta_hat),
                   beta_se = as.numeric(result$beta_se_ssa),
                   test_stat = as.numeric(result$test_result_t$test_stat),
                   critical_value = result$test_result_t$critical_value,
                   p_value = as.numeric(result$test_result_t$p_value))
    return(output)
}



SARA_exploratory_analysis <- function(
    dta,
    control_var,
    moderator,
    id_var = "userid",
    day_var = "Day",
    trt_var = "A",
    outcome_var = "Y",
    avail_var = NULL,
    prob_treatment = 1/2,
    significance_level = 0.025
) {
    ############## description ###############
    ##
    ## This function does exploratory analysis for SARA:
    ## it estimates moderated treatment effect, and test for no treatment by using an F-test.
    ##
    ## For more details, refer to the writeup for SARA analysis.
    
    ############## arguments ###############
    ##
    ## dta.............the data set in long format
    ## control_var...........vector of variable names used to reduce noise (Z in the model),
    ##                       could be NULL (no control covariates)
    ## moderator.............vector of variable names as effect modifiers (X in the model),
    ##                       could be NULL (no effect modifier)
    ## id_var................variable name for subject id (to distinguish between subjects in dta)
    ## day_var...............variable name for day in study (from 1 to max_days)
    ## max_days..............maximum of days observed for a participant
    ## trt_var...............variable name for treatment indicator
    ## outcome_var...........variable name for outcome variable
    ## avail_var.............variable name for availability variable
    ##                       NULL (default) means always-available
    ## prob_treatment........probability of treatment (default to 1/2)
    ## significance_level....significance level for the hypothesis testing (default to 0.025)
    
    ############## return value ###############
    ##
    ## This function returns a list of the following components:
    ##
    ## beta..................estimated beta (moderated treatment effect)
    ## beta_se...............standard error for beta, with small sample correction
    
    
    # make sure dta is sorted by id_var then day_var
    dta <- dta[order(dta[, id_var], dta[, day_var]), ]
    
    result <- binary_outcome_moderated_effect(dta = dta,
                                              control_var = control_var,
                                              moderator = moderator,
                                              id_var = id_var,
                                              day_var = day_var,
                                              max_days = 30,
                                              trt_var = trt_var,
                                              outcome_var = outcome_var,
                                              avail_var = avail_var,
                                              prob_treatment = prob_treatment,
                                              significance_level = significance_level,
                                              no_intercept_for_moderator = FALSE)
    output <- list(beta = result$beta_hat,
                   beta_se = result$beta_se_ssa)
                   # test_stat = result$test_result_f$test_stat,
                   # critical_value = result$test_result_f$critical_value,
                   # p_value = result$test_result_f$p_value
    ## test_stat.............F-test statsitic for testing beta = 0
    ## critical_value........critical value for F-test with the input significance level 
    ## p_value...............p-value for F-test
    return(output)
}






##### example to use the function #####

if (0) {
    
    dta <- readRDS("example_dataset.RDS")
    
    ### construct control covariates and moderators ###
    
    # previous day's outcome
    dta$Y_lag1 <- c(0, dta$Y[1:(nrow(dta)-1)])
    dta$Y_lag1[dta$Day == 1] <- 0 # fill in 0 for Y_lag1 on Day 1
    
    # previous day's at_tapcount
    dta$at_tapcount_lag1 <- c(0, dta$at_tapcount[1:(nrow(dta)-1)])
    dta$at_tapcount_lag1[is.na(dta$at_tapcount_lag1)] <- 0 # fill in 0 for at_tapcount_lag1 = NA
    
    ### try out the three analysis functions ###
    
    # primary hypothesis 1
    SARA_primary_hypothesis_1(dta, control_var = c("Y_lag1", "at_tapcount_lag1"))
    
    # primary hypothesis 2
    SARA_primary_hypothesis_2(dta, control_var = c("Y_lag1", "at_tapcount_lag1"), survey_completion_var = "Y")
    
    # exploratory analysis
    SARA_exploratory_analysis(dta, control_var = c("Y_lag1", "at_tapcount_lag1"), moderator = "Y_lag1")
    
    
    ### create fake availability indicator, and try the three analysis functions with availability ###
    
    dta2 <- dta
    dta2$avail <- rbinom(nrow(dta2), 1, 0.2)
    dta2$A[dta2$avail == 0] <- 0
    SARA_primary_hypothesis_1(dta2, control_var = c("Y_lag1", "at_tapcount_lag1"), avail_var = "avail")
    SARA_primary_hypothesis_2(dta2, control_var = c("Y_lag1", "at_tapcount_lag1"), survey_completion_var = "Y", avail_var = "avail")
    SARA_exploratory_analysis(dta2, control_var = c("Y_lag1", "at_tapcount_lag1"), moderator = "Y_lag1", avail_var = "avail")
    
}