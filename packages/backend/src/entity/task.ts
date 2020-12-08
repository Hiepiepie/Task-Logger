import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Tracking} from "./tracking";
import {Label} from "./label";

@Entity()
export class Task {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column({type: "text", nullable: true})
    description: string;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;

    @OneToMany(() => Tracking, (tracking: Tracking) => tracking.task, {
        eager: true,
        nullable: true,
        cascade: true
    })
    trackings: Tracking[];

    @ManyToMany(() => Label, (label: Label) => label.tasks, {
        eager: true,
        nullable: true,
        cascade: true
    })
    @JoinTable({name: "label_tasks"})
    labels: Label[];
}