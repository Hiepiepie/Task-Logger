import {Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Task} from "./task";

@Entity()
export class Label {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;

    @ManyToMany(() => Task, (task: Task) => task.labels,
        {nullable: true})
    tasks: Task[];
}