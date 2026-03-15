import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';
import GoogleAd from '../components/GoogleAd';
import { BiChevronRight, BiChevronLeft, BiCodeAlt, BiBookOpen, BiBulb, BiCommentDots, BiChat, BiTime, BiCalendar, BiShow } from 'react-icons/bi';
import { API_BASE_URL } from '../../utils/config';
import AuthService from '../../admin/services/AuthService';
import api from '../../api/general';

const StickyAd = ({ slot, position }) => (
  <div className={`hidden 2xl:flex fixed ${position === 'left' ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 w-[160px] flex-col justify-center z-50`}>
      <p className="text-[10px] text-gray-400 text-center mb-2 uppercase tracking-widest">Advertisement</p>
      <GoogleAd slot={slot} format="autorelaxed" fullWidthResponsive="true" style={{ display: 'block' }} immediate={true} />
  </div>
);

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

const QUESTIONS = [
  { type: 'header', title: "Most Asked Java Questions" },
  { type: 'text', q: "Why is Java a platform independent language?" },
  { type: 'text', q: "Why is Java not a pure object oriented language?" },
  { type: 'text', q: "Difference between Heap and Stack Memory in Java. And how java utilizes this." },
  { type: 'text', q: "Can java be said to be the complete object-oriented programming language?" },
  { type: 'text', q: "How is Java different from C++?" },
  { type: 'text', q: "Pointers are used in C/C++. Why does Java not make use of pointers?" },
  { type: 'text', q: "What do you understand by an instance variable and a local variable?" },
  { type: 'text', q: "What are the default values assigned to variables and instances in java?" },
  { type: 'text', q: "What do you mean by data encapsulation?" },
  { type: 'text', q: "Tell us something about JIT compiler." },
  { type: 'text', q: "Can you tell the difference between equals() method and equality operator (==) in Java?" },
  { type: 'text', q: "How is an infinite loop declared in Java?" },
  { type: 'text', q: "What is the difference between JDK, JRE, and JVM?" },
  { type: 'text', q: "What is the difference between static and non-static methods?" },
  { type: 'text', q: "Can we execute a Java program without main() method?" },
  { type: 'text', q: "What is the purpose of the 'static' keyword in Java?" },

  { type: 'header', title: "Core Java Fundamentals" },
  { type: 'text', q: "What is the difference between abstract class and interface?" },
  { type: 'text', q: "Can we create an object of an abstract class?" },
  { type: 'text', q: "What is the difference between final, finally, and finalize?" },
  { type: 'text', q: "What is the use of the transient keyword?" },
  { type: 'text', q: "What is the volatile keyword?" },
  { type: 'text', q: "What is serialization in Java?" },
  { type: 'text', q: "What is deserialization?" },
  { type: 'text', q: "What is the difference between Serializable and Externalizable?" },
  { type: 'text', q: "What is marker interface?" },
  { type: 'text', q: "What is cloning in Java?" },
  { type: 'text', q: "What is a wrapper class in Java?" },
  { type: 'text', q: "What is autoboxing and unboxing?" },
  { type: 'text', q: "What is the difference between constructor and method?" },
  { type: 'text', q: "What is constructor overloading?" },
  { type: 'text', q: "What is the purpose of 'this' and 'super' keywords?" },
  
  { type: 'header', title: "Memory Management & JVM" },
  { type: 'text', q: "What is heap memory in Java?" },
  { type: 'text', q: "What is stack memory?" },
  { type: 'text', q: "What is garbage collection?" },
  { type: 'text', q: "What are types of garbage collectors?" },
  { type: 'text', q: "What is memory leak in Java?" },
  { type: 'text', q: "What is OutOfMemoryError?" },
  { type: 'text', q: "What is the difference between heap and stack?" },
  { type: 'text', q: "What is a memory model in Java?" },
  { type: 'text', q: "What is Metaspace?" },
  { type: 'text', q: "What are strong, weak, soft, and phantom references?" },
  { type: 'text', q: "What is the role of ClassLoader in JVM?" },
  { type: 'text', q: "What is JIT (Just-In-Time) compiler?" },
  { type: 'text', q: "What is bytecode in Java?" },
  
  { type: 'header', title: "Java Collections Framework" },
  { type: 'text', q: "How does HashMap work internally?" },
  { type: 'text', q: "What is hashing?" },
  { type: 'text', q: "What is load factor in HashMap?" },
  { type: 'text', q: "What is collision in HashMap?" },
  { type: 'text', q: "What is ConcurrentHashMap?" },
  { type: 'text', q: "What is fail-fast and fail-safe iterator?" },
  { type: 'text', q: "What is Comparable interface?" },
  { type: 'text', q: "What is Comparator interface?" },
  { type: 'text', q: "What is PriorityQueue?" },
  { type: 'text', q: "What is BlockingQueue?" },
  { type: 'text', q: "Difference between ArrayList and LinkedList?" },
  { type: 'text', q: "Difference between HashMap and Hashtable?" },
  { type: 'text', q: "Difference between HashSet and TreeSet?" },
  { type: 'text', q: "How to sort a list of objects in Java?" },
  
  { type: 'header', title: "Multithreading & Concurrency" },
  { type: 'text', q: "What is ExecutorService?" },
  { type: 'text', q: "What is Callable interface?" },
  { type: 'text', q: "Difference between Callable and Runnable?" },
  { type: 'text', q: "What is thread pool?" },
  { type: 'text', q: "What is ForkJoinPool?" },
  { type: 'text', q: "What is race condition?" },
  { type: 'text', q: "What is wait() and notify()?" },
  { type: 'text', q: "What is sleep() vs wait()?" },
  { type: 'text', q: "What is thread starvation?" },
  { type: 'text', q: "What is livelock?" },
  { type: 'text', q: "What is the difference between user thread and daemon thread?" },
  { type: 'text', q: "What is the use of 'synchronized' block?" },
  { type: 'text', q: "What is Deadlock and how to avoid it?" },
  
  { type: 'header', title: "Java 8+ Features" },
  { type: 'text', q: "What is functional programming?" },
  { type: 'text', q: "What is predicate in Java?" },
  { type: 'text', q: "What is supplier interface?" },
  { type: 'text', q: "What is consumer interface?" },
  { type: 'text', q: "What is parallel stream?" },
  { type: 'text', q: "What is collect() method in streams?" },
  { type: 'text', q: "What is reduce() method?" },
  { type: 'text', q: "What is Optional?" },
  { type: 'text', q: "What are new features in Java 11?" },
  { type: 'text', q: "What are new features in Java 17?" },
  { type: 'text', q: "What is a Lambda Expression?" },
  { type: 'text', q: "What is Stream API in Java 8?" },
  { type: 'text', q: "What is the difference between map() and flatMap()?" },
  { type: 'text', q: "What are Default and Static methods in interfaces?" },

  { type: 'header', title: "Java Coding Programs" },
  { 
    type: 'code', 
    q: "1. Reverse a String", 
    code: `public class ReverseString { 
    public static void main(String[] args) { 
        String str = "Java"; 
        String reversed = ""; 

        for(int i = str.length()-1; i >= 0; i--) { 
            reversed += str.charAt(i); 
        } 

        System.out.println(reversed); 
    } 
}`
  },
  { 
    type: 'code', 
    q: "2. Check Palindrome", 
    code: `public class Palindrome { 
    public static void main(String[] args) { 
        String str = "madam"; 
        String rev = ""; 

        for(int i=str.length()-1;i>=0;i--){ 
            rev += str.charAt(i); 
        } 

        if(str.equals(rev)) 
            System.out.println("Palindrome"); 
        else 
            System.out.println("Not Palindrome"); 
    } 
}`
  },
  { 
    type: 'code', 
    q: "3. Find Duplicate Elements in Array", 
    code: `import java.util.*; 

public class DuplicateArray { 
    public static void main(String[] args) { 
        int arr[] = {1,2,3,2,4,5,3}; 
        Set<Integer> set = new HashSet<>(); 

        for(int num : arr){ 
            if(!set.add(num)) 
                System.out.println("Duplicate: " + num); 
        } 
    } 
}`
  },
  { 
    type: 'code', 
    q: "4. Find Largest Number in Array", 
    code: `public class LargestNumber { 
    public static void main(String[] args) { 
        int arr[] = {10,5,20,8}; 
        int max = arr[0]; 

        for(int i=1;i<arr.length;i++){ 
            if(arr[i] > max) 
                max = arr[i]; 
        } 

        System.out.println("Largest: "+max); 
    } 
}`
  },
  { 
    type: 'code', 
    q: "5. Fibonacci Series", 
    code: `public class Fibonacci { 
    public static void main(String[] args) { 
        int a = 0, b = 1; 
        for(int i=0;i<10;i++){ 
            System.out.print(a+" "); 
            int c = a + b; 
            a = b; 
            b = c; 
        } 
    } 
}`
  },
  { 
    type: 'code', 
    q: "6. Check Prime Number", 
    code: `public class PrimeCheck { 
    public static void main(String[] args) { 
        int num = 17; 
        boolean isPrime = true; 
        for(int i=2; i<=num/2; i++) { 
            if(num % i == 0) { 
                isPrime = false; 
                break; 
            } 
        } 
        System.out.println(isPrime ? "Prime" : "Not Prime"); 
    } 
}`
  },
  { 
    type: 'code', 
    q: "7. Swap Two Numbers without Third Variable", 
    code: `public class Swap { 
    public static void main(String[] args) { 
        int a = 10, b = 20; 
        a = a + b; 
        b = a - b; 
        a = a - b; 
        System.out.println("a: " + a + ", b: " + b); 
    } 
}`
  },
  { 
    type: 'code', 
    q: "8. Find Factorial of a Number", 
    code: `public class Factorial { 
    public static void main(String[] args) { 
        int num = 5, fact = 1; 
        for(int i=1; i<=num; i++) { 
            fact *= i; 
        } 
        System.out.println("Factorial: " + fact); 
    } 
}`
  },
  { 
    type: 'code', 
    q: "9. Check if Number is Armstrong", 
    code: `public class Armstrong { 
    public static void main(String[] args) { 
        int num = 153, originalNum, remainder, result = 0; 
        originalNum = num; 
        while (originalNum != 0) { 
            remainder = originalNum % 10; 
            result += Math.pow(remainder, 3); 
            originalNum /= 10; 
        } 
        System.out.println(result == num ? "Armstrong" : "Not Armstrong"); 
    } 
}`
  },
  { 
    type: 'code', 
    q: "10. Sort Array in Ascending Order", 
    code: `import java.util.Arrays; 

public class SortArray { 
    public static void main(String[] args) { 
        int[] arr = {5, 2, 8, 7, 1}; 
        Arrays.sort(arr); 
        System.out.println(Arrays.toString(arr)); 
    } 
}`
  },

  { type: 'header', title: "Spring Framework & Spring Boot" },
  { type: 'text', q: "What is Spring Framework?" },
  { type: 'text', q: "What is dependency injection?" },
  { type: 'text', q: "What is inversion of control (IoC)?" },
  { type: 'text', q: "What is Bean in Spring?" },
  { type: 'text', q: "What are different bean scopes?" },
  { type: 'text', q: "What is Spring Boot?" },
  { type: 'text', q: "What are advantages of Spring Boot?" },
  { type: 'text', q: "@SpringBootApplication?" },
  { type: 'text', q: "What is auto configuration?" },
  { type: 'text', q: "What is Spring Boot starter?" },
  { type: 'text', q: "What is @Component?" },
  { type: 'text', q: "What is @Service?" },
  { type: 'text', q: "What is @Repository?" },
  { type: 'text', q: "What is @Controller?" },
  { type: 'text', q: "What is @RestController?" },
  { type: 'text', q: "What is REST?" },
  { type: 'text', q: "What are REST principles?" },
  { type: 'text', q: "Difference between GET and POST?" },
  { type: 'text', q: "Difference between PUT and PATCH?" },
  { type: 'text', q: "What is @RequestMapping?" },
  { type: 'text', q: "What is Spring Data JPA?" },
  { type: 'text', q: "What is Hibernate?" },
  { type: 'text', q: "What is Entity?" },
  { type: 'text', q: "What is @Entity annotation?" },
  { type: 'text', q: "What is @Id annotation?" },
  { type: 'text', q: "What is microservice architecture?" },
  { type: 'text', q: "What is API Gateway?" },
  { type: 'text', q: "What is Service Discovery?" },
  { type: 'text', q: "What is Circuit Breaker?" },
  { type: 'text', q: "What is load balancing?" },
  { type: 'text', q: "What is Spring Security?" },
  { type: 'text', q: "What is JWT authentication?" },
  { type: 'text', q: "What is OAuth?" },
  { type: 'text', q: "What is authentication vs authorization?" },
  { type: 'text', q: "What is CSRF?" },
  { type: 'text', q: "What is AOP?" },
  { type: 'text', q: "What is @Transactional?" },
  { type: 'text', q: "What is caching in Spring Boot?" },
  { type: 'text', q: "What is Actuator?" },
  { type: 'text', q: "What is profile in Spring Boot?" },
  { type: 'text', q: "How do you handle exception globally?" },
  { type: 'text', q: "What is @ControllerAdvice?" },
  { type: 'text', q: "What is DTO?" },
  { type: 'text', q: "What is pagination?" },
  { type: 'text', q: "How to secure REST APIs?" },
  { type: 'text', q: "What is rate limiting?" },
  { type: 'text', q: "What is logging in Spring Boot?" },
  { type: 'text', q: "What is Swagger?" },
  { type: 'text', q: "What is Docker with Spring Boot?" },
  { type: 'text', q: "How do you deploy Spring Boot applications?" },
  { type: 'text', q: "What is Spring Boot DevTools?" },
  { type: 'text', q: "What is Spring Initializr?" },
  { type: 'text', q: "What is the use of @Value annotation?" },
  { type: 'text', q: "How to read properties from application.properties?" },
  { type: 'text', q: "What is the difference between @Mock and @MockBean?" },
  { type: 'text', q: "What is the use of @Primary annotation?" },
  { type: 'text', q: "What is the use of @Qualifier annotation?" },
  { type: 'text', q: "What is Spring Boot Actuator?" },
  { type: 'text', q: "How to change the port of a Spring Boot application?" },
  { type: 'text', q: "What is the difference between Spring and Spring Boot?" },
  { type: 'text', q: "What is the purpose of @Lazy annotation?" },
  { type: 'text', q: "What is the difference between constructor injection and setter injection?" },
  { type: 'text', q: "What is the use of @PostConstruct and @PreDestroy?" },

  { type: 'header', title: "Microservices & Cloud" },
  { type: 'text', q: "What are the benefits of Microservices architecture?" },
  { type: 'text', q: "What is the difference between Monolithic and Microservices?" },
  { type: 'text', q: "What is Spring Cloud?" },
  { type: 'text', q: "What is Service Registry (Eureka)?" },
  { type: 'text', q: "What is API Gateway (Zuul/Spring Cloud Gateway)?" },
  { type: 'text', q: "What is Config Server in Spring Cloud?" },
  { type: 'text', q: "What is Circuit Breaker (Hystrix/Resilience4j)?" },
  { type: 'text', q: "What is Distributed Tracing (Sleuth/Zipkin)?" },
  { type: 'text', q: "What is Load Balancing (Ribbon/LoadBalancer)?" },
  { type: 'text', q: "What is Docker and why use it with Microservices?" },

  { type: 'header', title: "Hibernate & JPA" },
  { type: 'text', q: "What is ORM (Object-Relational Mapping)?" },
  { type: 'text', q: "What is Hibernate Framework?" },
  { type: 'text', q: "What is the difference between JPA and Hibernate?" },
  { type: 'text', q: "What are the different states of a Hibernate object?" },
  { type: 'text', q: "What is Session and SessionFactory in Hibernate?" },
  { type: 'text', q: "What is the difference between get() and load() methods?" },
  { type: 'text', q: "What is HQL (Hibernate Query Language)?" },
  { type: 'text', q: "What is the difference between first-level and second-level cache?" },
  { type: 'text', q: "What is @OneToOne, @OneToMany, and @ManyToMany mapping?" },
  { type: 'text', q: "What is Lazy and Eager loading in Hibernate?" },

  { type: 'header', title: "Advanced Java & JVM Internals" },
  { type: 'text', q: "What is the difference between pass-by-value and pass-by-reference in Java?" },
  { type: 'text', q: "Why Java does not support pointers?" },
  { type: 'text', q: "What is the use of the native keyword?" },
  { type: 'text', q: "What is reflection in Java?" },
  { type: 'text', q: "What is class loader in Java?" },
  { type: 'text', q: "What are different types of class loaders?" },
  { type: 'text', q: "What is bootstrap class loader?" },
  { type: 'text', q: "What is extension class loader?" },
  { type: 'text', q: "What is application class loader?" },
  { type: 'text', q: "How does class loading work in Java?" },
  { type: 'text', q: "What are the components of JVM?" },
  { type: 'text', q: "What is method area in JVM?" },
  { type: 'text', q: "What is program counter register?" },
  { type: 'text', q: "What is bytecode verifier?" },
  { type: 'text', q: "What is interpreter vs JIT compiler?" },
  { type: 'text', q: "What is escape analysis?" },
  { type: 'text', q: "What is GC root?" },
  { type: 'text', q: "What is young generation in JVM?" },
  { type: 'text', q: "What is old generation in JVM?" },
  { type: 'text', q: "What is minor GC vs major GC?" },
  { type: 'text', q: "Can we override static methods?" },
  { type: 'text', q: "Can we override private methods?" },
  { type: 'text', q: "Can constructors be overridden?" },
  { type: 'text', q: "Can constructors be inherited?" },
  { type: 'text', q: "Can we have multiple main methods in Java?" },
  { type: 'text', q: "Can we overload main method?" },
  { type: 'text', q: "Can an interface extend another interface?" },
  { type: 'text', q: "Can a class implement multiple interfaces?" },
  { type: 'text', q: "Can an interface have static methods?" },
  { type: 'text', q: "Can an interface have default methods?" },
  { type: 'text', q: "What is Scanner class?" },
  { type: 'text', q: "What is BufferedReader?" },
  { type: 'text', q: "Difference between Scanner and BufferedReader?" },
  { type: 'text', q: "What is File class in Java?" },
  { type: 'text', q: "What is FileInputStream?" },
  { type: 'text', q: "What is FileOutputStream?" },
  { type: 'text', q: "What is ObjectInputStream?" },
  { type: 'text', q: "What is ObjectOutputStream?" },
  { type: 'text', q: "What is RandomAccessFile?" },
  { type: 'text', q: "What is Java NIO?" },
  { type: 'text', q: "What is immutable class?" },
  { type: 'text', q: "How do you create an immutable class?" },
  { type: 'text', q: "What is defensive copying?" },
  { type: 'text', q: "What are design patterns in Java?" },
  { type: 'text', q: "What is Singleton pattern?" },
  { type: 'text', q: "What is Factory pattern?" },
  { type: 'text', q: "What is Builder pattern?" },
  { type: 'text', q: "What is Dependency Injection pattern?" },
  { type: 'text', q: "What is SOLID principle?" },
  { type: 'text', q: "What are common Java performance optimization techniques?" },

  { type: 'header', title: "Java Design Patterns" },
  { type: 'text', q: "What is Singleton Design Pattern?" },
  { type: 'text', q: "What is Factory Method Design Pattern?" },
  { type: 'text', q: "What is Abstract Factory Design Pattern?" },
  { type: 'text', q: "What is Builder Design Pattern?" },
  { type: 'text', q: "What is Prototype Design Pattern?" },
  { type: 'text', q: "What is Adapter Design Pattern?" },
  { type: 'text', q: "What is Proxy Design Pattern?" },
  { type: 'text', q: "What is Observer Design Pattern?" },
  { type: 'text', q: "What is Strategy Design Pattern?" },
  { type: 'text', q: "What is MVC Design Pattern?" },

  { type: 'header', title: "Java Testing & JUnit" },
  { type: 'text', q: "What is Unit Testing?" },
  { type: 'text', q: "What is JUnit?" },
  { type: 'text', q: "What are JUnit annotations?" },
  { type: 'text', q: "What is @Test annotation?" },
  { type: 'text', q: "What is @BeforeEach and @AfterEach?" },
  { type: 'text', q: "What is Mockito?" },
  { type: 'text', q: "What is the difference between @Mock and @Spy?" },
  { type: 'text', q: "How to mock static methods in Mockito?" },
  { type: 'text', q: "What is Test-Driven Development (TDD)?" },
  { type: 'text', q: "What is Integration Testing?" },

  { type: 'header', title: "Output Based Java Questions" },
  { 
    type: 'output', 
    q: "Output Question 1", 
    code: `public class Test { 
    public static void main(String[] args) { 
        System.out.println(10 + 20 + "Java"); 
        System.out.println("Java" + 10 + 20); 
    } 
}`
  },
  { 
    type: 'output', 
    q: "Output Question 2", 
    code: `public class Test { 
    public static void main(String[] args) { 
        System.out.println(10 + 20 + "Java" + 10 + 20); 
    } 
}`
  },
  { 
    type: 'output', 
    q: "Output Question 3", 
    code: `public class Test { 
    public static void main(String[] args) { 
        int x = 5; 
        System.out.println(x++ + ++x); 
    } 
}`
  },
  { 
    type: 'output', 
    q: "Output Question 4", 
    code: `public class Test { 
    public static void main(String[] args) { 
        int x = 10; 
        System.out.println(x++ + x++ + ++x); 
    } 
}`
  },
  { 
    type: 'output', 
    q: "Output Question 5", 
    code: `public class Test { 
    public static void main(String[] args) { 
        String s1 = "Java"; 
        String s2 = "Java"; 
        System.out.println(s1 == s2); 
    } 
}`
  },
  { 
    type: 'output', 
    q: "Output Question 6", 
    code: `public class Test { 
    public static void main(String[] args) { 
        String s1 = new String("Java"); 
        String s2 = new String("Java"); 
        System.out.println(s1 == s2); 
    } 
}`
  },
  { 
    type: 'output', 
    q: "Output Question 7", 
    code: `public class Test { 
    public static void main(String[] args) { 
        String s1 = "Java"; 
        String s2 = new String("Java"); 
        System.out.println(s1.equals(s2)); 
    } 
}`
  },
  { 
    type: 'output', 
    q: "Output Question 8", 
    code: `public class Test { 
    public static void main(String[] args) { 
        int x = 10; 
        int y = 20; 
        if(x < y) 
            if(x == 10) 
                System.out.println("Hello"); 
            else 
                System.out.println("Hi"); 
    } 
}`
  },
  { 
    type: 'output', 
    q: "Output Question 9", 
    code: `public class Test { 
    public static void main(String[] args) { 
        System.out.println('A' + 'B'); 
    } 
}`
  },
  { 
    type: 'output', 
    q: "Output Question 10", 
    code: `public class Test { 
    public static void main(String[] args) { 
        System.out.println("A" + "B"); 
    } 
}`
  },
  { 
    type: 'output', 
    q: "Output Question 11", 
    code: `public class Test { 
    public static void main(String[] args) { 
        int x = 5; 
        int y = x++ + ++x; 
        System.out.println(y); 
    } 
}`
  },
  { 
    type: 'output', 
    q: "Output Question 12", 
    code: `public class Test { 
    public static void main(String[] args) { 
        int i = 1; 
        while(i++ < 5){ 
            System.out.print(i); 
        } 
    } 
}`
  },
  { 
    type: 'output', 
    q: "Output Question 13", 
    code: `public class Test { 
    public static void main(String[] args) { 
        for(int i=0;i<5;i++){ 
            System.out.print(i); 
        } 
    } 
}`
  },
  { 
    type: 'output', 
    q: "Output Question 14", 
    code: `public class Test { 
    public static void main(String[] args) { 
        Integer a = 100; 
        Integer b = 100; 
        System.out.println(a == b); 
    } 
}`
  },
  { 
    type: 'output', 
    q: "Output Question 15", 
    code: `public class Test { 
    public static void main(String[] args) { 
        Integer a = 200; 
        Integer b = 200; 
        System.out.println(a == b); 
    } 
}`
  },
  { 
    type: 'output', 
    q: "Output Question 16", 
    code: `public class Test { 
    public static void main(String[] args) { 
        String s = null; 
        System.out.println(s); 
    } 
}`
  },
  { 
    type: 'output', 
    q: "Output Question 17", 
    code: `public class Test { 
    public static void main(String[] args) { 
        String s = null; 
        System.out.println(s.length()); 
    } 
}`
  },
  { 
    type: 'output', 
    q: "Output Question 18", 
    code: `public class Test { 
    public static void main(String[] args) { 
        int arr[] = new int[3]; 
        System.out.println(arr[0]); 
    } 
}`
  },
  { 
    type: 'output', 
    q: "Output Question 19", 
    code: `public class Test { 
    public static void main(String[] args) { 
        int arr[] = new int[3]; 
        System.out.println(arr.length); 
    } 
}`
  },
  { 
    type: 'output', 
    q: "Output Question 20", 
    code: `public class Test { 
    public static void main(String[] args) { 
        System.out.println(10/0); 
    } 
}`
  },
  { 
    type: 'output', 
    q: "Output Question 21", 
    code: `System.out.println(10.0/0);`
  },
  { 
    type: 'output', 
    q: "Output Question 22", 
    code: `System.out.println(0.0/0);`
  },
  { 
    type: 'output', 
    q: "Output Question 23", 
    code: `public class Test { 
    static int x; 
    public static void main(String[] args) { 
        System.out.println(x); 
    } 
}`
  },
  { 
    type: 'output', 
    q: "Output Question 24", 
    code: `public class Test { 
    static String s; 
    public static void main(String[] args) { 
        System.out.println(s); 
    } 
}`
  },
  { 
    type: 'output', 
    q: "Output Question 25", 
    code: `public class Test { 
    public static void main(String[] args) { 
        int x = 5; 
        System.out.println(x += 3 * 2); 
    } 
}`
  },
  { 
    type: 'output', 
    q: "Output Question 26", 
    code: `public class Test { 
    public static void main(String[] args) { 
        int x = 10; 
        System.out.println(x > 5 ? "Yes" : "No"); 
    } 
}`
  },
  { 
    type: 'output', 
    q: "Output Question 27", 
    code: `public class Test { 
    public static void main(String[] args) { 
        int x = 10; 
        if(x = 5) 
            System.out.println("Hello"); 
    } 
}`
  },
  { 
    type: 'output', 
    q: "Output Question 28", 
    code: `public class Test { 
    public static void main(String[] args) { 
        int x = 10; 
        System.out.println(x++ + ++x + x); 
    } 
}`
  },
  { 
    type: 'output', 
    q: "Output Question 29", 
    code: `public class Test { 
    public static void main(String[] args) { 
        String s = "Java"; 
        s.concat("World"); 
        System.out.println(s); 
    } 
}`
  },
  { 
    type: 'output', 
    q: "Output Question 30", 
    code: `public class Test { 
    public static void main(String[] args) { 
        String s = "Java"; 
        s = s.concat("World"); 
        System.out.println(s); 
    } 
}`
  },
  { 
    type: 'output', 
    q: "Output Question 31", 
    code: `System.out.println(5 + 5 + "5");`
  },
  { 
    type: 'output', 
    q: "Output Question 32", 
    code: `System.out.println("5" + 5 + 5);`
  },
  { 
    type: 'output', 
    q: "Output Question 33", 
    code: `System.out.println("5" + (5 + 5));`
  },
  { 
    type: 'output', 
    q: "Output Question 34", 
    code: `public class Test { 
    public static void main(String[] args) { 
        int x = 0; 
        System.out.println(x++); 
        System.out.println(x); 
    } 
}`
  },
  { 
    type: 'output', 
    q: "Output Question 35", 
    code: `public class Test { 
    public static void main(String[] args) { 
        int x = 0; 
        System.out.println(++x); 
    } 
}`
  },
  { 
    type: 'output', 
    q: "Output Question 36", 
    code: `System.out.println(true + "");`
  },
  { 
    type: 'output', 
    q: "Output Question 37", 
    code: `System.out.println("Java" == new String("Java"));`
  },
  { 
    type: 'output', 
    q: "Output Question 38", 
    code: `System.out.println("Java".equals(new String("Java")));`
  },
  { 
    type: 'output', 
    q: "Output Question 39", 
    code: `System.out.println(Math.min(10,20));`
  },
  { 
    type: 'output', 
    q: "Output Question 40", 
    code: `System.out.println(Math.max(10,20));`
  },
  { 
    type: 'output', 
    q: "Output Question 41", 
    code: `System.out.println(Math.sqrt(25));`
  },
  { 
    type: 'output', 
    q: "Output Question 42", 
    code: `System.out.println(5 % 2);`
  },
  { 
    type: 'output', 
    q: "Output Question 43", 
    code: `System.out.println(5 % 5);`
  },
  { 
    type: 'output', 
    q: "Output Question 44", 
    code: `System.out.println("Java".substring(1,3));`
  },
  { 
    type: 'output', 
    q: "Output Question 45", 
    code: `System.out.println("Java".charAt(2));`
  },
  { 
    type: 'output', 
    q: "Output Question 46", 
    code: `System.out.println("Java".length());`
  },
  { 
    type: 'output', 
    q: "Output Question 47", 
    code: `System.out.println("Java".toUpperCase());`
  },
  { 
    type: 'output', 
    q: "Output Question 48", 
    code: `System.out.println("JAVA".toLowerCase());`
  },
  { 
    type: 'output', 
    q: "Output Question 49", 
    code: `System.out.println(" Java ".trim());`
  },
  { 
    type: 'output', 
    q: "Output Question 50", 
    code: `System.out.println(String.valueOf(100));`
  }
];

const ITEMS_PER_PAGE = 20;

const JavaInterviewQuestions = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [postingComment, setPostingComment] = useState(false);
  const [user, setUser] = useState(null);
  const [viewCount, setViewCount] = useState(0);
  const [secondsSpent, setSecondsSpent] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const API_BASE = API_BASE_URL;
  const viewTracked = useRef(false);

  // Real-time clock and time spent tracker
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsSpent(prev => prev + 1);
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimeSpent = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).replace(/ /g, ' ');
  };

  // Load user
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        setUser(parsed);
      } catch (e) {
        console.error('Error parsing user', e);
      }
    }
  }, []);

  // Fetch analytics (view count)
  const fetchAnalytics = async () => {
    if (!AuthService.isAdmin()) return;
    try {
      const token = AuthService.getToken();
      // Backend expects GET /api/analytics/count/{pageName}
      const res = await fetch(`${API_BASE}/api/analytics/count/java-interview-questions`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setViewCount(data || 0);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/jobs/java-interview-questions/comments`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
    fetchComments();
  }, [API_BASE]);

  const handlePostComment = async () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      toast.error('Please login to comment');
      return;
    }

    let userObj;
    try {
      userObj = JSON.parse(userStr);
    } catch {
      toast.error('Invalid user session');
      return;
    }

    if (!commentText.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    const actualUser = userObj.data || userObj.user || userObj;
    let userId = actualUser.id || actualUser.userId || actualUser.uid;

    // Fallback: Extract ID from token if missing
    if (!userId && (actualUser.token || actualUser.access_token)) {
      const token = actualUser.token || actualUser.access_token;
      const decoded = parseJwt(token);
      if (decoded) {
        userId = decoded.id || decoded.userId || decoded.uid || decoded.sub;
      }
    }

    const userName = actualUser.name || actualUser.username || (actualUser.email ? actualUser.email.split('@')[0] : 'User');
    const userEmail = actualUser.email || '';

    if (!userId) {
      toast.error('User ID missing. Please logout and login again.');
      return;
    }

    setPostingComment(true);
    try {
      const response = await fetch(`${API_BASE}/api/jobs/java-interview-questions/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          userName,
          userEmail,
          content: commentText
        })
      });

      if (response.ok) {
        const newComment = await response.json();
        setComments([newComment, ...comments]);
        setCommentText('');
        toast.success('Comment posted successfully!');
      } else {
        toast.error('Failed to post comment');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error('Error posting comment');
    } finally {
      setPostingComment(false);
    }
  };

  const handleSuggestion = () => {
    navigate('/suggestion');
  };

  // View Tracking Logic
  useEffect(() => {
    if (viewTracked.current) return;
    viewTracked.current = true;

    const recordView = async () => {
      try {
        const userStr = localStorage.getItem('user');
        let userId = null;
        let token = null;

        if (userStr) {
          try {
            const userObj = JSON.parse(userStr);
            const actualUser = userObj.data || userObj.user || userObj;
            userId = actualUser.id || actualUser.userId || actualUser.uid;
            token = actualUser.token || actualUser.access_token;

            if (!userId && token) {
              const decoded = parseJwt(token);
              if (decoded) {
                userId = decoded.id || decoded.userId || decoded.uid || decoded.sub;
              }
            }
          } catch (e) {
            console.error('Error parsing user for analytics', e);
          }
        }

        // If no user, generate guest ID
        if (!userId) {
          userId = `guest_view_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }

        // Logic: Logged in users count once, Guests count every time
        const isGuest = userId.toString().startsWith('guest_');
        const storageKey = !isGuest ? `view_tracked_java_interview_questions_${userId}` : null;
        
        if (storageKey && localStorage.getItem(storageKey)) {
          console.log('View already tracked for this user');
          fetchAnalytics(); // Still fetch for admin to see current count
          return;
        }

        console.log("Tracking view for:", userId);
        
        // Matching backend @PathVariable String pageName and @RequestParam String userId
        await fetch(`${API_BASE}/api/analytics/java/view/java-interview-questions?userId=${userId}`, {
          method: 'POST',
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });

        if (storageKey) {
          localStorage.setItem(storageKey, 'true');
        }
        
        // Refresh stats after recording
        fetchAnalytics();
      } catch (error) {
        console.error('Error recording view:', error);
      }
    };

    recordView();
  }, [API_BASE]);

  // Page specific ad slots
  const getPageAdSlot = (page, position) => {
    if (page === 1) {
      return position === 'top' ? '5422661412' : '8880857403';
    }
    if (page === 2) {
      return '2583042366';
    }
    if (page === 3) {
      return '3495336229';
    }
    // Fallback slots
    return position === 'top' ? '7461144152' : '5313492962';
  };

  // Pagination logic
  const totalPages = Math.ceil(QUESTIONS.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentQuestions = useMemo(() => 
    QUESTIONS.slice(startIndex, startIndex + ITEMS_PER_PAGE),
    [startIndex]
  );

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Helper to get question number
  const getQuestionNumber = (itemIndex) => {
    const previousItems = QUESTIONS.slice(0, itemIndex);
    const questionCount = previousItems.filter(item => item.type !== 'header').length;
    return questionCount;
  };

  return (
    <div className="min-h-screen bg-white pt-44 md:pt-52 pb-12 px-3 sm:px-6 lg:px-8 font-sans">
      <SEO 
        title={`Java Interview Questions for Freshers 2026 - US, UK, Australia, India | BCVWorld`}
        description="Cracking Java interviews in 2026? Access 250+ most asked technical questions for freshers at top MNCs in US, UK, India, and Australia. Includes Core Java, Spring Boot, and Coding."
        keywords="java interview questions for freshers 2026, java technical round questions, java developer jobs US UK India Australia, core java questions for freshers, spring boot interview questions, mnc interview questions for freshers, coding interview prep java, java oop interview questions, bcvworld java guide"
      />

      {/* Structured Data for Google Search (Rich Results) */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": QUESTIONS.slice(0, 10).filter(q => q.type === 'text').map(q => ({
            "@type": "Question",
            "name": q.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Detailed answer available on BCVWorld.com Java Interview Guide."
            }
          }))
        })}
      </script>

      {/* Sticky Ads - Hidden on smaller screens */}
      <StickyAd slot="3854428879" position="left" />
      <StickyAd slot="9757492242" position="right" />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 md:mb-10 border-b border-gray-100 pb-6 md:pb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
              Java Most Asked Interview Questions for Freshers
            </h1>
            <div className="flex flex-wrap gap-3 self-start md:self-center">
              <button 
                onClick={handleSuggestion}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
              >
                <BiBulb /> Suggestion
              </button>
            </div>
          </div>

          {/* Real-time Stats Header */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mb-10 text-[15px] font-bold text-gray-500 border-b border-gray-50 pb-6">
            <div className="flex items-center gap-2.5">
              <BiCalendar className="text-blue-500 text-xl" />
              <span className="tracking-tight">{formatDate(currentTime)}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <BiTime className="text-indigo-500 text-xl" />
              <span className="font-mono tracking-tighter">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <BiTime className="text-emerald-500 text-xl" />
              <span className="opacity-60 text-xs uppercase tracking-widest">Session:</span>
              <span className="text-emerald-600">{formatTimeSpent(secondsSpent)}</span>
            </div>
            {/* Admin Only View Count - Cleaner Badge */}
            {AuthService.isAdmin() && (
              <div className="flex items-center gap-2 ml-auto px-4 py-1.5 bg-gray-900 text-white rounded-full shadow-lg hover:scale-105 transition-transform cursor-default">
                <BiShow className="text-amber-400 text-lg" />
                <span className="text-[11px] uppercase tracking-[0.2em] font-black text-gray-400">Total Views</span>
                <span className="text-base font-black text-white ml-1">{viewCount.toLocaleString()}</span>
              </div>
            )}
          </div>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed">
            A comprehensive list of 250+ technical interview questions covering Core Java, Spring Boot, and Coding challenges.
          </p>
        </div>

        {/* Top Ad */}
        <div className="my-6 md:my-8">
          <GoogleAd slot={getPageAdSlot(currentPage, 'top')} format="auto" fullWidthResponsive="true" immediate={true} />
        </div>

        <div className="space-y-6 md:space-y-8">
          {currentQuestions.map((item, index) => (
            <React.Fragment key={startIndex + index}>
              <div className="text-gray-800">
                {item.type === 'header' ? (
                  <div className="pt-6 md:pt-8 pb-3 md:pb-4 border-b-2 border-blue-500 mb-4 md:mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <BiBookOpen className="text-blue-600 flex-shrink-0" />
                      <span className="line-clamp-1">{item.title}</span>
                    </h2>
                  </div>
                ) : (
                  <>
                    <h3 className="font-bold text-lg md:text-xl mb-2 md:mb-3 flex items-start gap-2 md:gap-3">
                      <span className="text-blue-600 whitespace-nowrap">Q{getQuestionNumber(startIndex + index) + 1}.</span>
                      <span className="break-words">{item.q}</span>
                    </h3>

                    {item.type === 'code' && (
                      <div className="mt-2 md:mt-3">
                        <p className="text-xs md:text-sm font-bold text-blue-600 mb-1.5 md:mb-2 flex items-center gap-2">
                          <BiCodeAlt /> Solution:
                        </p>
                        <pre className="bg-gray-900 text-white p-4 md:p-5 rounded-lg overflow-x-auto text-[13px] md:text-sm leading-relaxed scrollbar-thin scrollbar-thumb-gray-700">
                          {item.code}
                        </pre>
                      </div>
                    )}

                    {item.type === 'output' && (
                      <div className="mt-2 md:mt-3">
                        <pre className="bg-gray-50 border border-gray-200 p-4 md:p-5 rounded-lg overflow-x-auto text-[13px] md:text-sm scrollbar-thin scrollbar-thumb-gray-200">
                          {item.code}
                        </pre>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Ad after every 10 items (except last one on page) */}
              {(index + 1) % 10 === 0 && index !== currentQuestions.length - 1 && (
                <div className="my-6 md:my-8 py-3 md:py-4 border-y border-gray-50 bg-gray-50/30">
                  <p className="text-[10px] text-gray-400 text-center mb-2 uppercase tracking-widest">Advertisement</p>
                  <GoogleAd slot="1059387337" format="auto" fullWidthResponsive="true" immediate={true} />
                </div>
              )}

              {/* Mobile-only ad after every 5 items (to increase frequency on mobile) */}
              {(index + 1) % 5 === 0 && (index + 1) % 10 !== 0 && index !== currentQuestions.length - 1 && (
                <div className="lg:hidden my-4 md:my-6 py-2 border-y border-gray-50 bg-gray-50/20">
                   <p className="text-[8px] text-gray-400 text-center mb-1 uppercase tracking-widest">Sponsored</p>
                   <GoogleAd slot="1059387337" format="auto" fullWidthResponsive="true" immediate={true} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Images for SEO/Visual Content */}
        {currentPage === 1 && (
          <div className="my-8 md:my-12">
            <img 
              src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1000" 
              alt="Java Programming Technical Interview" 
              className="w-full rounded-xl shadow-sm mb-3 md:mb-4"
            />
            <p className="text-center text-gray-500 text-xs md:text-sm italic px-2">Mastering Java fundamentals is key to cracking technical rounds.</p>
          </div>
        )}

        {/* Mid Ad */}
        <div className="my-8 md:my-12">
          <GoogleAd slot="3905517884" format="auto" fullWidthResponsive="true" immediate={true} />
        </div>

        {/* Comments Section */}
        <section className="mt-8 mb-12 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <BiCommentDots className="text-blue-600" />
              Discussion ({comments.length})
            </h3>
          </div>

          <div className="p-6">
            {/* Comment Input */}
            <div className="mb-8">
              {user ? (
                <div className="space-y-4">
                  <textarea
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-gray-700"
                    rows="3"
                    placeholder="Have a question or a better solution? Share it here..."
                    maxLength={500}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                      {commentText.length}/500 Characters
                    </span>
                    <button
                      className={`px-6 py-2 rounded-lg font-bold transition-all shadow-sm ${
                        !commentText.trim() || postingComment 
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                          : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                      }`}
                      onClick={handlePostComment}
                      disabled={postingComment || !commentText.trim()}
                    >
                      {postingComment ? 'Posting...' : 'Post Comment'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center">
                  <p className="text-blue-800 font-medium mb-4">Please login to join the discussion and post comments.</p>
                  <Link 
                    to="/login" 
                    className="inline-flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Login to Comment
                  </Link>
                </div>
              )}
            </div>

            {/* Comments List */}
            <div className="space-y-6">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
                      {comment.userName ? comment.userName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900">{comment.userName || 'User'}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600 leading-relaxed break-words">{comment.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center">
                  <BiChat className="text-4xl text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 font-medium">No comments yet. Be the first to start the discussion!</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Pagination */}
        <div className="flex flex-col items-center justify-center space-y-4 mt-12 md:mt-16 pt-6 md:pt-8 border-t border-gray-100">
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-1.5 sm:p-2 rounded-full border ${currentPage === 1 ? 'text-gray-300 border-gray-100 cursor-not-allowed' : 'text-blue-600 border-blue-100 hover:bg-blue-50'}`}
              aria-label="Previous Page"
            >
              <BiChevronLeft size={20} className="sm:hidden" />
              <BiChevronLeft size={24} className="hidden sm:block" />
            </button>
            
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto max-w-[200px] sm:max-w-none px-2 py-1 no-scrollbar">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`min-w-[32px] sm:w-10 h-8 sm:h-10 rounded-full font-bold transition-all text-sm sm:text-base ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-1.5 sm:p-2 rounded-full border ${currentPage === totalPages ? 'text-gray-300 border-gray-100 cursor-not-allowed' : 'text-blue-600 border-blue-100 hover:bg-blue-50'}`}
              aria-label="Next Page"
            >
              <BiChevronRight size={20} className="sm:hidden" />
              <BiChevronRight size={24} className="hidden sm:block" />
            </button>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">Page {currentPage} of {totalPages}</p>
        </div>

        {/* SEO Content Sections */}
        <div className="mt-16 space-y-12 border-t border-gray-100 pt-12 text-gray-800">
          <div className="my-8">
            <p className="text-[10px] text-gray-400 text-center mb-2 uppercase tracking-widest">Sponsored</p>
            <GoogleAd slot="3317539539" format="autorelaxed" fullWidthResponsive="true" immediate={true} />
          </div>
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <BiBulb className="text-yellow-500 flex-shrink-0" />
              How to Prepare for Java Interviews in 2026
            </h2>
            <div className="prose prose-slate max-w-none space-y-4 text-gray-600 leading-relaxed">
              <p>
                Preparing for a <strong>Java technical interview</strong> as a fresher can be challenging. To succeed in 2026, you need a solid grasp of <strong>Core Java fundamentals</strong>, as well as an understanding of modern frameworks like <strong>Spring Boot</strong> and <strong>Microservices</strong>.
              </p>
              <p>
                Our comprehensive guide covers everything from <strong>Object-Oriented Programming (OOP)</strong> principles to advanced <strong>JVM internals</strong>. Whether you are preparing for a top MNC or a high-growth startup, these <strong>most asked Java questions</strong> will help you build the confidence needed to clear technical rounds.
              </p>
              <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
                <li><strong>Master Core Concepts:</strong> Focus on <strong>Collections</strong>, <strong>Multithreading</strong>, and <strong>Exception Handling</strong>.</li>
                <li><strong>Practice Coding:</strong> Solve <strong>Java programming problems</strong> frequently asked in coding rounds, such as string manipulation and array sorting.</li>
                <li><strong>Learn Java 8+ Features:</strong> Be ready to explain <strong>Lambda Expressions</strong>, <strong>Streams API</strong>, and <strong>Optional</strong>.</li>
                <li><strong>Understand Frameworks:</strong> Gain a basic understanding of <strong>Spring Boot auto-configuration</strong> and <strong>Dependency Injection</strong>.</li>
              </ul>
            </div>
          </section>

          <section className="bg-blue-50 rounded-2xl p-6 md:p-8 border border-blue-100">
            <h2 className="text-xl md:text-2xl font-bold text-blue-900 mb-4">
              Comprehensive Java Topic Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-bold text-blue-800">Core Java & JVM</h3>
                <p className="text-sm text-blue-700/80">
                  Detailed questions on <strong>JDK vs JRE vs JVM</strong>, <strong>Garbage Collection</strong>, and <strong>Memory Management</strong> (Heap vs Stack).
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-blue-800">Frameworks & Tools</h3>
                <p className="text-sm text-blue-700/80">
                  Essential <strong>Spring Boot interview questions</strong>, including <strong>REST API design</strong>, <strong>Hibernate/JPA</strong>, and <strong>Microservices architecture</strong>.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-blue-800">Coding & Logic</h3>
                <p className="text-sm text-blue-700/80">
                  Step-by-step <strong>Java programs with solutions</strong> for common coding challenges like <strong>Fibonacci series</strong> and <strong>Palindrome checks</strong>.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-blue-800">Advanced Topics</h3>
                <p className="text-sm text-blue-700/80">
                  Deep dive into <strong>Java Design Patterns</strong> (Singleton, Factory) and <strong>Unit Testing with JUnit and Mockito</strong>.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Why Prepare with BCVWorld?
            </h2>
            <p className="text-gray-600 leading-relaxed">
              At <strong>BCVWorld</strong>, we are committed to providing the best resources for freshers. Our <strong>Java Interview Questions for Freshers 2026</strong> page is curated by industry experts and updated regularly to reflect the latest hiring trends. Combine this guide with our <strong>Freshers Job Tracker</strong> to find and apply for the latest <strong>Java developer roles</strong> in real-time.
            </p>
          </section>
        </div>

        {/* Bottom Ad */}
        <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-100">
          <GoogleAd slot={getPageAdSlot(currentPage, 'bottom')} format="auto" fullWidthResponsive="true" immediate={true} />
        </div>
      </div>
    </div>
  );
};

export default JavaInterviewQuestions;
