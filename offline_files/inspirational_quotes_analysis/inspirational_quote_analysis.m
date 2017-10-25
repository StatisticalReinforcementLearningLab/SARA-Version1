clear;
close all;

quote_ranks = [5.666666667,5.333333333,4.333333333,4,4,5.333333333,3,3.333333333,4,4.666666667,5,2.333333333,2.333333333,2.333333333,3.333333333,4,5,4,3.666666667,5,4.666666667,4.333333333,5.333333333,5.666666667,6.666666667,6.333333333,6,5.666666667,5.333333333,4.666666667,5.666666667,6.666666667,6,4.666666667,6.666666667,7,4,4.333333333,6.333333333,4.666666667,6,3.666666667,6.666666667,6.666666667,4,6.333333333,4.666666667,6,6.333333333,5.333333333,6,6,3.666666667,6,5,5.666666667,3,2.333333333,5,6];


%see distribution
hist(quote_ranks);


%get 5 or more
five_or_more = sum(quote_ranks>5);


%how many quotes do we need.
total_messages_array = [];
for times = 1:10000
    
    %
    total_messages = 0;
    
    %generate message count
    for d = 1:30 
        is_randomized = rand(1,1)>=0.5;
        total_messages = total_messages + is_randomized;
    end
    total_messages_array = [total_messages_array ; total_messages];
end
std(total_messages_array)
hist(total_messages_array)

%we need around 25 messages. We have 28 messages that are quite good.





